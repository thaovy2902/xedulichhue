/**
 * Root layout (under the [locale] segment, so <html lang> comes straight
 * from the route param). Not reading request headers keeps every page
 * statically pre-rendered at build time.
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Be_Vietnam_Pro } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { JsonLd } from '@/components/seo/JsonLd'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/lib/site'
import '../globals.css'

const fontSans = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Pre-render a static page for each supported locale at build time
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params

  const languageAlternates = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`])
  )

  const isVi = locale === 'vi'
  const description = isVi
    ? 'Dịch vụ xe du lịch Huế chuyên nghiệp: đưa đón sân bay Phú Bài, tour tham quan Cố đô Huế, xe đi Đà Nẵng – Hội An và các tỉnh. Xe 4, 7, 16 chỗ. Giá cạnh tranh, đúng giờ, hỗ trợ 24/7.'
    : 'Professional Hue tourism transport: Phu Bai airport transfers, Hue city tours, and inter-provincial trips. 4, 7 & 16-seat vehicles. Competitive rates, on-time, 24/7 support.'

  return {
    metadataBase: new URL(siteConfig.url),
    robots: { index: true, follow: true },
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: isVi
      ? ['xe du lịch Huế', 'đưa đón sân bay Phú Bài', 'tour tham quan Huế', 'xe đi Đà Nẵng', 'cho thuê xe Huế', 'xe du lịch Huế 4 7 16 chỗ']
      : ['Hue tourism transport', 'Phu Bai airport transfer', 'Hue city tour', 'Hue to Da Nang', 'car rental Hue', 'Hue private car'],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        ...languageAlternates,
        'x-default': `${siteConfig.url}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isVi ? 'vi_VN' : 'en_US',
      alternateLocale: isVi ? 'en_US' : 'vi_VN',
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: isVi
        ? 'Xe Du Lịch Huế 4,7,16 Chỗ | Đưa Đón Sân Bay Phú Bài, Tour Tham Quan Huế'
        : 'Hue Tourism Transport | Phu Bai Airport Transfers & Hue City Tours',
      description,
      images: siteConfig.ogImage
        ? [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: isVi
        ? 'Xe Du Lịch Huế 4,7,16 Chỗ | Đưa Đón Sân Bay Phú Bài'
        : 'Hue Tourism Transport | Phu Bai Airport Transfers',
      description,
      images: siteConfig.ogImage ? [{ url: siteConfig.ogImage, alt: siteConfig.name }] : [],
    },
    // Google Search Console token (HTML-tag method), set on Vercel
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    }),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Guard against unknown locales (e.g. /xx/whatever)
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  // Make the locale available to all server components in this subtree
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning className={fontSans.variable}>
      {/*
        FOUC prevention: runs before first paint, reads localStorage and
        applies the correct dark/light class to <html> immediately.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';if(t==='system')t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* NextIntlClientProvider reads messages & locale from server context */}
        <NextIntlClientProvider>
          <JsonLd locale={locale} />
          <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingContact />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
