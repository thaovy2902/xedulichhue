'use server'

import { headers } from 'next/headers'
import {
  sendBookingEmail,
  sendBookingTelegram,
  sendCustomerConfirmation,
  type BookingRequest,
} from '@/lib/notify'

// ─── Types ─────────────────────────────────────────────────────────────────

export type BookingField = 'contact' | 'email' | 'pickup' | 'dropoff' | 'datetime'

/** Error values are translation keys under `booking.errors` */
export type BookingErrorKey = 'required' | 'contactRequired' | 'invalidEmail' | 'invalidPhone'

export interface BookingState {
  status: 'idle' | 'success' | 'error'
  /** Translation key under `booking.errors` for a form-level error */
  message?: 'rateLimited' | 'sendFailed'
  fieldErrors?: Partial<Record<BookingField, BookingErrorKey>>
  /** Submitted values, so the form can be refilled after React resets it */
  values?: Record<string, string>
}

// ─── Rate limit ────────────────────────────────────────────────────────────
// Best-effort, per server instance: on Vercel each instance keeps its own map.

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function field(formData: FormData, key: string, max = 200) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s.()-]{8,20}$/

// ─── Action ────────────────────────────────────────────────────────────────

export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot: real users never see or fill this field
  if (field(formData, 'company')) return { status: 'success' }

  const req: BookingRequest = {
    phone: field(formData, 'phone', 30),
    email: field(formData, 'email', 120),
    contactVia: field(formData, 'contactVia', 30),
    pickup: field(formData, 'pickup'),
    dropoff: field(formData, 'dropoff'),
    datetime: field(formData, 'datetime', 40),
    vehicle: field(formData, 'vehicle', 30),
    note: field(formData, 'note', 1000),
    locale: field(formData, 'locale', 5) === 'en' ? 'en' : 'vi',
  }

  const fieldErrors: BookingState['fieldErrors'] = {}
  if (!req.pickup) fieldErrors.pickup = 'required'
  if (!req.dropoff) fieldErrors.dropoff = 'required'
  if (!req.datetime) fieldErrors.datetime = 'required'
  if (!req.phone && !req.email) fieldErrors.contact = 'contactRequired'
  if (req.phone && !PHONE_RE.test(req.phone)) fieldErrors.contact = 'invalidPhone'
  if (req.email && !EMAIL_RE.test(req.email)) fieldErrors.email = 'invalidEmail'
  const values = { ...req }
  if (Object.keys(fieldErrors).length) return { status: 'error', fieldErrors, values }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) return { status: 'error', message: 'rateLimited', values }

  // Notify on both channels; the request succeeds if at least one gets through.
  const results = await Promise.allSettled([sendBookingTelegram(req), sendBookingEmail(req)])
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[booking] ${i === 0 ? 'telegram' : 'email'} failed:`, r.reason)
    }
  })
  if (results.every((r) => r.status === 'rejected')) {
    return { status: 'error', message: 'sendFailed', values }
  }

  // Customer confirmation is a nice-to-have; never fail the booking over it.
  await sendCustomerConfirmation(req).catch((err) => {
    console.error('[booking] customer confirmation failed:', err)
  })

  return { status: 'success' }
}
