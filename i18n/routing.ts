import { defineRouting } from 'next-intl/routing'

export const locales = ['vi', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

/**
 * Shared routing configuration for middleware and navigation helpers.
 * Supports locale prefix on all routes - / redirects to /vi.
 *
 * To add a new locale:
 *   1. Add to `locales` array above
 *   2. Create messages/<locale>.json
 *   3. That's it - routing and navigation update automatically.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
