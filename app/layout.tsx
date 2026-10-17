/**
 * Root layout - minimal shell required by Next.js.
 *
 * The `lang` attribute is set dynamically from the `x-locale` header
 * that proxy.ts injects for every request, so screen readers and
 * search engines always see the correct language.
 *
 * All providers (ThemeProvider, NextIntlClientProvider), the Header,
 * and the Footer live in app/[locale]/layout.tsx.
 */
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import { siteConfig } from '@/lib/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  robots: { index: true, follow: true },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers()
  // Set by proxy.ts so the html[lang] attribute is correct per locale
  const locale = headersList.get('x-locale') ?? 'vi'

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      {/*
        FOUC prevention: runs before first paint, reads localStorage and
        applies the correct dark/light class to <html> immediately.
        Placed here in a Server Component so React never reconciles it
        client-side - avoiding the React 19 "script tag in component tree" warning.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';if(t==='system')t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  )
}
