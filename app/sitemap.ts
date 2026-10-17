import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/lib/site'

const baseUrl = siteConfig.url

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }))
}
