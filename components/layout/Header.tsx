'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type KeyboardEvent,
} from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useTranslations } from 'next-intl'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type Variants,
} from 'framer-motion'
import { Sun, Moon, Phone, CarFront } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig, PHONE_TEL } from '@/lib/site'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LanguageSwitcher } from './LanguageSwitcher'

// ─── Constants ────────────────────────────────────────────────────────────────

const SCROLL_THRESHOLD = 20    // px before header gets background
const HEADER_HEIGHT    = 72    // px - used for scroll-spy offset

// ─── Animation variants ───────────────────────────────────────────────────────

const drawerVariants: Variants = {
  closed: {
    x: '100%',
    transition: { type: 'spring', damping: 32, stiffness: 340, mass: 0.8 },
  },
  open: {
    x: 0,
    transition: { type: 'spring', damping: 32, stiffness: 340, mass: 0.8 },
  },
}

const backdropVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open:   { opacity: 1, transition: { duration: 0.25 } },
}

const drawerListVariants: Variants = {
  closed: {},
  open: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
}

const drawerItemVariants: Variants = {
  closed: { x: 28, opacity: 0 },
  open:   { x: 0,  opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
}

// ─── HamburgerIcon ────────────────────────────────────────────────────────────
//
// Three bars that animate into an × when isOpen is true.

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  const state = isOpen ? 'open' : 'closed'
  const ease: [number, number, number, number] = [0.23, 1, 0.32, 1]

  return (
    <div className="relative flex h-5 w-6 flex-col justify-between" aria-hidden="true">
      {/* Top bar */}
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current"
        animate={
          isOpen
            ? { rotate: 45, y: 9, scaleX: 1 }
            : { rotate: 0, y: 0, scaleX: 1 }
        }
        transition={{ duration: 0.3, ease }}
      />
      {/* Middle bar */}
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current"
        animate={isOpen ? { opacity: 0, scaleX: 0.5 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* Bottom bar */}
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current"
        animate={
          isOpen
            ? { rotate: -45, y: -9, scaleX: 1 }
            : { rotate: 0, y: 0, scaleX: 1 }
        }
        transition={{ duration: 0.3, ease }}
      />
    </div>
  )
}

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  // Use the resolved theme: on first visit `theme` is 'system', which is
  // neither 'light' nor 'dark', so comparing it would show the wrong icon.
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" /> // size placeholder prevents layout shift

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg',
        'text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
      aria-label={isDark ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-[18px] w-[18px]" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-[18px] w-[18px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
//
// Desktop navigation link. For anchor hrefs renders a plain <a> (no locale
// prefix needed). Active indicator animates using Framer Motion layoutId.

interface NavLinkProps {
  href: string
  isActive: boolean
  children: React.ReactNode
  onClick?: () => void
}

function NavLink({ href, isActive, children, onClick }: NavLinkProps) {
  const isAnchor = href.startsWith('#')

  const className = cn(
    'relative px-3 py-2 text-sm font-medium rounded-md',
    'transition-colors duration-200 outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    isActive
      ? 'text-primary'
      : 'text-muted-foreground hover:text-foreground'
  )

  const content = (
    <>
      {children}
      {isActive && (
        <motion.span
          layoutId="nav-active-indicator"
          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        />
      )}
    </>
  )

  if (isAnchor) {
    return (
      <a href={href} className={className} onClick={onClick} aria-current={isActive ? 'location' : undefined}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  )
}

// ─── MobileDrawer ─────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  t: ReturnType<typeof useTranslations>
}

function MobileDrawer({ isOpen, onClose, activeSection, t }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const callHref = siteConfig.contact.phone
    ? PHONE_TEL
    : '#contact'

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Focus first element when drawer opens
  useEffect(() => {
    if (isOpen) {
      const first = drawerRef.current?.querySelector<HTMLElement>(
        'button, a, [tabindex]'
      )
      first?.focus()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="drawer-panel"
            ref={drawerRef}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              'fixed right-0 top-0 z-50 h-full w-[85vw] max-w-sm',
              'flex flex-col bg-background shadow-2xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              {/* Logo */}
              <a
                href="/"
                onClick={onClose}
                className="flex items-center gap-2.5 font-bold text-foreground"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <CarFront className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
                <span className="text-base uppercase">{siteConfig.name}</span>
              </a>

              {/* Close button */}
              <button
                onClick={onClose}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  'text-muted-foreground hover:text-foreground hover:bg-muted',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Đóng menu"
              >
                <HamburgerIcon isOpen />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <motion.nav
                variants={drawerListVariants}
                initial="closed"
                animate="open"
                aria-label="Mobile navigation"
              >
                <ul className="flex flex-col gap-1" role="list">
                  {siteConfig.nav.map((item) => {
                    const isActive = activeSection === item.href
                    const isAnchor = item.href.startsWith('#')
                    const linkClass = cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3',
                      'text-base font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-accent text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )

                    return (
                      <motion.li key={item.key} variants={drawerItemVariants}>
                        {isActive && (
                          <span
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                        )}
                        {isAnchor ? (
                          <a
                            href={item.href}
                            className={cn('relative', linkClass)}
                            onClick={onClose}
                            aria-current={isActive ? 'true' : undefined}
                          >
                            {isActive && (
                              <span
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                                aria-hidden="true"
                              />
                            )}
                            {t(item.key as Parameters<typeof t>[0])}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn('relative', linkClass)}
                            onClick={onClose}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {isActive && (
                              <span
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                                aria-hidden="true"
                              />
                            )}
                            {t(item.key as Parameters<typeof t>[0])}
                          </Link>
                        )}
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.nav>
            </div>

            {/* Drawer footer */}
            <div className="border-t border-border px-4 py-4 space-y-3">
              {/* Language + Theme row */}
              <div className="flex items-center justify-between px-1">
                <LanguageSwitcher variant="inline-compact" />
                <ThemeToggle />
              </div>

              {/* CTA */}
              <a
                href={callHref}
                onClick={onClose}
                className={cn(
                  'flex h-11 w-full items-center justify-center gap-2 rounded-xl',
                  'bg-secondary text-secondary-foreground font-semibold text-sm',
                  'transition-all duration-200 hover:bg-secondary-600 active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t('callNow')}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled]     = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const t = useTranslations('nav')

  const callHref = siteConfig.contact.phone
    ? PHONE_TEL
    : '#contact'

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  // ── Scroll detection (background + scroll-spy) ──────────────────────────
  useEffect(() => {
    const anchors = siteConfig.nav
      .filter((item) => item.href.startsWith('#'))
      .map((item) => item.href)

    const onScroll = () => {
      const scrollY = window.scrollY

      // Background trigger
      setIsScrolled(scrollY > SCROLL_THRESHOLD)

      // Scroll-spy: the section whose top is closest above the header line.
      // Compared by page position, not nav order, so the two can differ.
      if (anchors.length > 0) {
        let current = ''
        let bestTop = -Infinity
        for (const anchor of anchors) {
          const el = document.getElementById(anchor.slice(1))
          if (!el) continue
          const top = el.getBoundingClientRect().top - HEADER_HEIGHT - 1
          if (top <= 0 && top > bestTop) {
            bestTop = top
            current = anchor
          }
        }
        // At the very bottom the last section (footer contact) may never reach
        // the header line, so pick it explicitly.
        const atBottom =
          window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2
        if (atBottom) current = anchors[anchors.length - 1]
        setActiveSection(current)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run once on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close drawer on resize to desktop ───────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsDrawerOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Animated background bar */}
        <motion.div
          animate={
            isScrolled
              ? {
                  backgroundColor: 'var(--background)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 1px 0 0 var(--border), 0 4px 16px -4px rgb(0 0 0 / 0.08)',
                }
              : {
                  backgroundColor: 'transparent',
                  backdropFilter: 'blur(0px)',
                  boxShadow: 'none',
                }
          }
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 -z-10"
          style={{ WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)' }}
        />

        <Container>
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ──────────────────────────────────────────────── */}
            <a
              href="/"
              className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              aria-label={`${siteConfig.name} - trang chủ`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <CarFront className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
              <span className="text-base font-bold tracking-tight uppercase text-foreground">
                {siteConfig.name}
              </span>
            </a>

            {/* ── Desktop nav (center) ───────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {siteConfig.nav.map((item) => (
                <NavLink
                  key={item.key}
                  href={item.href}
                  isActive={activeSection === item.href}
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </NavLink>
              ))}
            </nav>

            {/* ── Desktop actions (right) ────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <LanguageSwitcher variant="dropdown" />
              <ThemeToggle />
              <div className="ml-2">
                <a
                  href={callHref}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-lg px-4',
                    'bg-secondary text-secondary-foreground text-sm font-semibold',
                    'transition-all duration-200',
                    'hover:bg-secondary-600 hover:shadow-secondary active:scale-[0.97]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  )}
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('callNow')}
                </a>
              </div>
            </div>

            {/* ── Mobile actions ─────────────────────────────────────── */}
            <div className="flex md:hidden items-center gap-1 shrink-0">
              <ThemeToggle />
              <button
                onClick={() => setIsDrawerOpen((prev) => !prev)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  'text-foreground transition-colors',
                  'hover:bg-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
                aria-label={isDrawerOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={isDrawerOpen}
                aria-controls="mobile-drawer"
              >
                <HamburgerIcon isOpen={isDrawerOpen} />
              </button>
            </div>

          </div>
        </Container>
      </header>

      {/* ── Mobile drawer (outside header so it overlays everything) ── */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        activeSection={activeSection}
        t={t}
      />
    </>
  )
}
