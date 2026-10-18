'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { ADS_ID, GA_ID, conversionForHref, trackConversion } from '@/lib/analytics'

/**
 * Loads gtag.js once for both GA4 and Google Ads, and reports clicks on
 * any tel: / sms: / zalo.me link on the page as a conversion. Renders
 * nothing when neither ID is configured.
 */
export function GoogleTag() {
  const ids = [GA_ID, ADS_ID].filter(Boolean)

  useEffect(() => {
    if (ids.length === 0) return

    // Delegated listener: covers header, floating buttons, footer, etc.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const type = conversionForHref(link.getAttribute('href') ?? '')
      if (type) trackConversion(type)
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [ids.length])

  if (ids.length === 0) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${ids
          .map((id) => `gtag('config','${id}');`)
          .join('')}`}
      </Script>
    </>
  )
}
