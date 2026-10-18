'use client'

import { useActionState, useEffect, useState, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CheckCircle2, Clock, Mail, Phone, ShieldCheck, Zap } from 'lucide-react'
import { submitBooking, type BookingField, type BookingState } from '@/app/actions/booking'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { siteConfig, PHONE_TEL } from '@/lib/site'
import { cn } from '@/lib/utils'
import { trackConversion } from '@/lib/analytics'

const INITIAL_STATE: BookingState = { status: 'idle' }

const inputClass = cn(
  'w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground outline-none transition-shadow duration-150',
  'focus:ring-2 focus:ring-ring focus:ring-offset-0',
  'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/40',
)

// ─── BookingSection ────────────────────────────────────────────────────────

export function BookingSection() {
  const t = useTranslations('booking')
  // Bumping the key remounts the form, clearing its action state
  const [formKey, setFormKey] = useState(0)

  const perks = [
    { Icon: Zap, text: t('perks.fast') },
    { Icon: ShieldCheck, text: t('perks.fixed') },
    { Icon: Clock, text: t('perks.anytime') },
  ]

  return (
    <section id="booking" className="py-16 md:py-24 bg-background">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14 items-start">
          {/* ── Intro ─────────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              label={t('badge')}
              title={t('title')}
              description={t('subtitle')}
              align="left"
            />

            <ul className="mt-6 space-y-3">
              {perks.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-foreground">
              {t('preferCall')}{' '}
              <a href={PHONE_TEL} className="font-semibold text-primary hover:underline">
                {siteConfig.contact.phone}
              </a>
            </p>
          </div>

          {/* ── Form card ─────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
            <BookingForm key={formKey} onReset={() => setFormKey((k) => k + 1)} />
          </div>
        </div>
      </Container>
    </section>
  )
}

// ─── BookingForm ───────────────────────────────────────────────────────────

function BookingForm({ onReset }: { onReset: () => void }) {
  const t = useTranslations('booking')
  const locale = useLocale()
  const [state, formAction, pending] = useActionState(submitBooking, INITIAL_STATE)
  const v = state.values ?? {}

  const err = (key: BookingField) => {
    const code = state.fieldErrors?.[key]
    return code ? t(`errors.${code}`) : undefined
  }

  if (state.status === 'success') {
    return (
      <SuccessPanel
        title={t('success.title')}
        desc={t('success.desc')}
        again={t('success.again')}
        onAgain={onReset}
      />
    )
  }

  return (
    <form action={formAction} noValidate className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot - hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Contact: phone OR email (at least one) */}
      <Field label={t('fields.phone')} icon={<Phone className="h-3.5 w-3.5" />} error={err('contact')}>
        <input name="phone" defaultValue={v.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+84 ..." className={inputClass} aria-invalid={!!err('contact')} />
      </Field>
      <Field label={t('fields.email')} icon={<Mail className="h-3.5 w-3.5" />} error={err('email')}>
        <input name="email" defaultValue={v.email} type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} aria-invalid={!!err('email')} />
      </Field>
      <p className="sm:col-span-2 -mt-1.5 text-xs text-muted-foreground">{t('contactHint')}</p>

      <Field label={t('fields.pickup')} required error={err('pickup')}>
        <input name="pickup" defaultValue={v.pickup} placeholder={t('placeholders.pickup')} className={inputClass} aria-invalid={!!err('pickup')} />
      </Field>
      <Field label={t('fields.dropoff')} required error={err('dropoff')}>
        <input name="dropoff" defaultValue={v.dropoff} placeholder={t('placeholders.dropoff')} className={inputClass} aria-invalid={!!err('dropoff')} />
      </Field>

      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
        <Field label={t('fields.datetime')} required error={err('datetime')}>
          <input name="datetime" defaultValue={v.datetime} type="datetime-local" className={inputClass} aria-invalid={!!err('datetime')} />
        </Field>
        <Field label={t('fields.vehicle')}>
          <select name="vehicle" defaultValue={v.vehicle ?? ''} className={inputClass}>
            <option value="">{t('vehicle.any')}</option>
            <option value="4 chỗ">{t('vehicle.car4')}</option>
            <option value="7 chỗ">{t('vehicle.car7')}</option>
            <option value="16 chỗ">{t('vehicle.car16')}</option>
          </select>
        </Field>
        <Field label={t('fields.contactVia')}>
          <select name="contactVia" defaultValue={v.contactVia ?? ''} className={inputClass}>
            <option value="">{t('contactVia.any')}</option>
            <option value="Gọi điện">{t('contactVia.call')}</option>
            <option value="Zalo">Zalo</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
          </select>
        </Field>
      </div>

      <Field label={t('fields.note')} className="sm:col-span-2">
        <textarea
          name="note"
          defaultValue={v.note}
          rows={2}
          placeholder={t('placeholders.note')}
          className={cn(inputClass, 'h-auto py-2.5 resize-y')}
        />
      </Field>

      {state.message && (
        <p role="alert" className="sm:col-span-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {t(`errors.${state.message}`)}
        </p>
      )}

      <div className="sm:col-span-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-xs text-muted-foreground">{t('privacy')}</p>
        <Button type="submit" variant="secondary" loading={pending} className="sm:min-w-36 shrink-0">
          {pending ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  )
}

// ─── Bits ──────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  icon?: ReactNode
  className?: string
}

function Field({ label, children, required, error, icon, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
        {required && <span className="text-destructive" aria-hidden="true">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}

function SuccessPanel({ title, desc, again, onAgain }: { title: string; desc: string; again: string; onAgain: () => void }) {
  // Shown once per successful submission - report it as a booking conversion
  useEffect(() => trackConversion('booking'), [])

  return (
    <div role="status" className="flex flex-col items-center text-center py-10">
      <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">{desc}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline-primary">
          <a href={PHONE_TEL}>
            <Phone className="h-4 w-4" aria-hidden="true" /> {siteConfig.contact.phone}
          </a>
        </Button>
        <Button variant="ghost" onClick={onAgain}>{again}</Button>
      </div>
    </div>
  )
}
