/**
 * Root route fallback.
 *
 * In practice, proxy.ts (middleware) always redirects `/` → `/vi`
 * before this page is reached. This redirect is a safety net for
 * environments where the proxy doesn't run (e.g. static export).
 */
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
