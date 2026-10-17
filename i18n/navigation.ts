/**
 * Locale-aware navigation helpers.
 *
 * Import these instead of `next/navigation` / `next/link`:
 *   import { Link, redirect, usePathname, useRouter } from '@/i18n/navigation'
 *
 * The returned Link automatically prepends the active locale to hrefs.
 * The returned useRouter / redirect / usePathname are locale-aware too.
 */
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing)
