'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'
import { ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Locale metadata ──────────────────────────────────────────────────────────

const LOCALE_FLAG: Record<Locale, string> = {
  vi: '🇻🇳',
  en: '🇬🇧',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  /**
   * dropdown      - trigger + popover (desktop header)
   * inline        - full list with labels (mobile drawer full section)
   * inline-compact - single-row button row (mobile drawer footer)
   */
  variant?: 'dropdown' | 'inline' | 'inline-compact'
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const locale   = useLocale() as Locale
  const router   = useRouter()
  const pathname = usePathname()
  const t        = useTranslations('languageSwitcher')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next })
    setIsOpen(false)
  }

  // ── inline-compact: icon buttons row ─────────────────────────────────────
  if (variant === 'inline-compact') {
    return (
      <div className="flex items-center gap-1" aria-label={t('label')}>
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            aria-label={t(l)}
            aria-pressed={l === locale}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
              l === locale
                ? 'bg-accent text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {LOCALE_FLAG[l]}
            </span>
            <span className="text-xs">{l.toUpperCase()}</span>
          </button>
        ))}
      </div>
    )
  }

  // ── inline: full list (mobile drawer main area) ───────────────────────────
  if (variant === 'inline') {
    return (
      <div className="flex flex-col gap-1">
        <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('label')}
        </p>
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            aria-label={t(l)}
            aria-pressed={l === locale}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              'hover:bg-muted hover:text-foreground',
              l === locale
                ? 'bg-accent text-primary'
                : 'text-muted-foreground'
            )}
          >
            <span className="text-base" aria-hidden="true">{LOCALE_FLAG[l]}</span>
            <span>{t(l)}</span>
            {l === locale && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    )
  }

  // ── dropdown (desktop header) ─────────────────────────────────────────────
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t('label')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-lg px-2.5',
          'text-sm font-medium text-muted-foreground',
          'transition-colors hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{LOCALE_FLAG[locale]}</span>
        <span className="hidden sm:inline text-xs">{locale.toUpperCase()}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('label')}
          className={cn(
            'absolute right-0 z-50 mt-1.5 min-w-[160px] overflow-hidden',
            'rounded-xl border border-border bg-background p-1 shadow-elevated'
          )}
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => switchLocale(l)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-muted',
                l === locale
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <span className="text-base" aria-hidden="true">{LOCALE_FLAG[l]}</span>
              <span>{t(l)}</span>
              {l === locale && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
