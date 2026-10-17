'use client'

/**
 * Custom theme provider - no inline <script> injection.
 *
 * React 19 warns when <script> tags appear inside client component trees
 * (next-themes v0.4.6 does this for FOUC prevention). We handle FOUC
 * instead via a <script> in the root Server Component layout (app/layout.tsx),
 * which React never reconciles client-side and thus never warns about.
 *
 * API mirrors next-themes so callsites are unchanged:
 *   const { theme, setTheme, resolvedTheme } = useTheme()
 */

import { createContext, useContext, useEffect, useState } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme | undefined
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  /** Passed by [locale]/layout.tsx for compatibility - ignored (class always used) */
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}

// ─── Context ───────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
  systemTheme: undefined,
})

// ─── Helpers ───────────────────────────────────────────────────────────────

const MQ = '(prefers-color-scheme: dark)'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(MQ).matches ? 'dark' : 'light'
}

function applyTheme(resolved: ResolvedTheme, disableTransition: boolean) {
  const root = document.documentElement
  if (disableTransition) root.setAttribute('data-no-transition', '')
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  if (disableTransition) {
    // Force a reflow, then re-enable transitions
    void root.offsetHeight
    root.removeAttribute('data-no-transition')
  }
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | undefined>(undefined)

  // Resolve the effective theme (never 'system')
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemTheme ?? 'light') : theme

  // On mount: read stored preference and current system theme
  useEffect(() => {
    const sys = getSystemTheme()
    setSystemTheme(sys)

    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setThemeState(stored)
        applyTheme(stored === 'system' ? sys : stored, disableTransitionOnChange)
      } else {
        applyTheme(defaultTheme === 'system' ? sys : (defaultTheme as ResolvedTheme), disableTransitionOnChange)
      }
    } catch {
      applyTheme(sys, disableTransitionOnChange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track system preference changes when theme === 'system'
  useEffect(() => {
    if (!enableSystem) return
    const mq = window.matchMedia(MQ)
    const handler = (e: MediaQueryListEvent) => {
      const sys: ResolvedTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(sys)
      if (theme === 'system') applyTheme(sys, disableTransitionOnChange)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, enableSystem, disableTransitionOnChange])

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== storageKey || !e.newValue) return
      const next = e.newValue as Theme
      setThemeState(next)
      applyTheme(next === 'system' ? getSystemTheme() : next, disableTransitionOnChange)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey, disableTransitionOnChange])

  function setTheme(next: Theme) {
    setThemeState(next)
    try { localStorage.setItem(storageKey, next) } catch { /* noop */ }
    const sys = getSystemTheme()
    applyTheme(next === 'system' ? sys : next, disableTransitionOnChange)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
