import 'server-only'
import nodemailer from 'nodemailer'

// ─── Booking request shape ─────────────────────────────────────────────────

export interface BookingRequest {
  phone: string
  email: string
  contactVia: string
  pickup: string
  dropoff: string
  datetime: string
  vehicle: string
  note: string
  locale: string
}

const LABELS: Record<keyof Omit<BookingRequest, 'locale'>, string> = {
  phone: 'SĐT / Zalo / WhatsApp',
  email: 'Email',
  contactVia: 'Liên hệ qua',
  pickup: 'Điểm đón',
  dropoff: 'Điểm đến',
  datetime: 'Thời gian đón',
  vehicle: 'Loại xe',
  note: 'Ghi chú',
}

function rows(req: BookingRequest) {
  return (Object.keys(LABELS) as (keyof typeof LABELS)[])
    .filter((key) => req[key])
    .map((key) => [LABELS[key], key === 'datetime' ? formatDatetime(req.datetime) : req[key]] as const)
}

/** "2026-10-20T08:30" → "08:30 20/10/2026" */
export function formatDatetime(value: string) {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/)
  return m ? `${m[4]} ${m[3]}/${m[2]}/${m[1]}` : value
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Email (Gmail SMTP with an App Password) ───────────────────────────────

function getMailer() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  return {
    user,
    transport: nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }),
  }
}

export async function sendBookingEmail(req: BookingRequest) {
  const mailer = getMailer()
  if (!mailer) throw new Error('Email is not configured (GMAIL_USER / GMAIL_APP_PASSWORD)')

  const to = process.env.BOOKING_EMAIL_TO || mailer.user
  const table = rows(req)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td>` +
        `<td style="padding:6px 0;color:#111827;font-weight:600">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')

  await mailer.transport.sendMail({
    from: `"Website đặt xe" <${mailer.user}>`,
    to,
    replyTo: req.email || undefined,
    subject: `🚗 Đơn đặt xe mới: ${req.pickup} → ${req.dropoff}`,
    text: rows(req).map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: `<div style="font-family:Arial,sans-serif;font-size:14px">
      <h2 style="color:#0a66e8;margin:0 0 12px">Đơn đặt xe mới từ website</h2>
      <table style="border-collapse:collapse">${table}</table>
    </div>`,
  })
}

/** Confirmation sent to the customer when they left an email address. */
export async function sendCustomerConfirmation(req: BookingRequest) {
  const mailer = getMailer()
  if (!mailer || !req.email) return

  const isVi = req.locale === 'vi'
  const subject = isVi
    ? 'Chúng tôi đã nhận yêu cầu đặt xe của bạn'
    : 'We have received your booking request'
  const intro = isVi
    ? `Xin chào, cảm ơn bạn đã đặt xe. Chúng tôi sẽ liên hệ lại với bạn trong ít phút để xác nhận lịch trình và báo giá.`
    : `Hi, thank you for your booking request. We will contact you within a few minutes to confirm the itinerary and fare.`
  const summary = `${escapeHtml(req.pickup)} → ${escapeHtml(req.dropoff)}, ${escapeHtml(formatDatetime(req.datetime))}`

  await mailer.transport.sendMail({
    from: `"Xe Du Lịch Huế" <${mailer.user}>`,
    to: req.email,
    subject,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111827">
      <p>${intro}</p>
      <p style="font-weight:600">${summary}</p>
      <p>Hotline / Zalo / WhatsApp: <b>077.246.7711</b></p>
    </div>`,
  })
}

// ─── Telegram bot ──────────────────────────────────────────────────────────

export async function sendBookingTelegram(req: BookingRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Telegram is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)')

  const text = [
    '🚗 <b>Đơn đặt xe mới</b>',
    '',
    ...rows(req).map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value)}`),
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
  if (!res.ok) throw new Error(`Telegram API ${res.status}: ${await res.text()}`)
}
