/**
 * Next.js 16 Proxy (formerly middleware.ts).
 *
 * Handles locale-based routing via next-intl:
 *  - Redirects /  → /vi  (default locale)
 *  - Passes /vi/* and /en/* through unchanged
 *  - Sets `x-locale` request header so the root layout can read it
 *    and set the correct `lang` attribute on <html>.
 */
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

function resolveLocaleFromPathname(request: NextRequest): string {
  const { pathname } = request.nextUrl
  return (
    (routing.locales as readonly string[]).find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    ) ?? routing.defaultLocale
  )
}

export function proxy(request: NextRequest) {
  const locale = resolveLocaleFromPathname(request)
  const response = handleI18nRouting(request)

  // Forward the locale to Next.js server components via request header
  response.headers.set('x-locale', locale)

  return response
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)',
  ],
}
