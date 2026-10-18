/**
 * GA4 + Google Ads helpers. Everything is a no-op until the IDs below are
 * set (NEXT_PUBLIC_* vars are inlined at build time - redeploy after
 * changing them on Vercel).
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? ''

export type ConversionType = 'call' | 'sms' | 'zalo' | 'booking'

/** Google Ads conversion labels, one per conversion action */
const ADS_LABELS: Record<ConversionType, string | undefined> = {
  call: process.env.NEXT_PUBLIC_ADS_LABEL_CALL,
  sms: process.env.NEXT_PUBLIC_ADS_LABEL_SMS,
  zalo: process.env.NEXT_PUBLIC_ADS_LABEL_ZALO,
  booking: process.env.NEXT_PUBLIC_ADS_LABEL_BOOKING,
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Report a lead action to GA4 (as an event) and Google Ads (as a conversion). */
export function trackConversion(type: ConversionType) {
  const gtag = typeof window !== 'undefined' ? window.gtag : undefined
  if (!gtag) return

  if (GA_ID) {
    gtag('event', type === 'booking' ? 'generate_lead' : 'contact', {
      method: type,
    })
  }

  const label = ADS_LABELS[type]
  if (ADS_ID && label) {
    gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` })
  }
}

/** Map a clicked link to a conversion type, if it is a contact link. */
export function conversionForHref(href: string): ConversionType | null {
  if (href.startsWith('tel:')) return 'call'
  if (href.startsWith('sms:')) return 'sms'
  if (/^https?:\/\/(www\.)?zalo\.me\//.test(href)) return 'zalo'
  return null
}
