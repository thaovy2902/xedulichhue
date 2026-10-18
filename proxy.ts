/**
 * Next.js 16 Proxy (formerly middleware.ts).
 *
 * Handles locale-based routing via next-intl:
 *  - Redirects /  → /vi  (default locale)
 *  - Passes /vi/* and /en/* through unchanged
 */
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export const proxy = createMiddleware(routing)

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)',
  ],
}
