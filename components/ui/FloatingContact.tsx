'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageSquareText } from 'lucide-react'
import { siteConfig, PHONE_TEL, PHONE_SMS } from '@/lib/site'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ZaloLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#0068FF" />
      <path
        d="M12 4h26c4.4 0 7 2.6 7 7v21c0 4.4-2.6 7-7 7H19l-9.5 5 2-6.3C7.6 36.4 6 33.6 6 29V11c0-4.4 2.6-7 6-7z"
        fill="#fff"
      />
      <text
        x="25.5"
        y="27"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="#0068FF"
      >
        Zalo
      </text>
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactButton {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  bg: string
  hoverBg: string
  /** Tailwind bg class for the pulsing ring */
  ringBg: string
  delay: number
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FloatingContact() {
  const buttons: ContactButton[] = [
    {
      id: 'call',
      label: 'Gọi ngay',
      href: PHONE_TEL,
      icon: <Phone className="h-5 w-5" />,
      bg: 'bg-primary',
      hoverBg: 'hover:bg-primary/90',
      ringBg: 'bg-primary',
      delay: 0,
    },
    {
      id: 'sms',
      label: 'Nhắn tin SMS',
      href: PHONE_SMS,
      icon: <MessageSquareText className="h-5 w-5" />,
      bg: 'bg-success',
      hoverBg: 'hover:bg-success/90',
      ringBg: 'bg-success',
      delay: 0.08,
    },
    {
      id: 'zalo',
      label: 'Zalo',
      href: siteConfig.social.zalo ?? '#',
      icon: (
        <span className="block h-full w-full overflow-hidden rounded-full">
          <ZaloLogo className="h-full w-full" />
        </span>
      ),
      bg: 'bg-white',
      hoverBg: '',
      ringBg: 'bg-[#0068FF]',
      delay: 0.16,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6"
      aria-label="Floating contact buttons"
    >
      {buttons.map((btn) => (
        <FloatingButton key={btn.id} btn={btn} />
      ))}
    </motion.div>
  )
}

// ─── Individual Button ────────────────────────────────────────────────────────

function FloatingButton({ btn }: { btn: ContactButton }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="relative pointer-events-none rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap"
          >
            {btn.label}
            {/* Arrow pointing right */}
            <span
              className="absolute top-1/2 -translate-y-1/2"
              style={{ right: '-5px', width: 0, height: 0, borderStyle: 'solid', borderWidth: '4px 0 4px 5px', borderColor: 'transparent transparent transparent #171717' }}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={btn.href}
        target={btn.id === 'zalo' ? '_blank' : undefined}
        rel={btn.id === 'zalo' ? 'noopener noreferrer' : undefined}
        aria-label={btn.label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -6, 0],
        }}
        transition={{
          scale: { delay: btn.delay + 0.1, type: 'spring', stiffness: 400, damping: 18 },
          opacity: { delay: btn.delay + 0.1, duration: 0.2 },
          y: {
            delay: btn.delay + 0.6,
            duration: 2.4,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          },
        }}
        whileHover={{ scale: 1.12, y: 0 }}
        whileTap={{ scale: 0.93 }}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-colors ${btn.bg} ${btn.hoverBg} sm:h-13 sm:w-13 relative`}
      >
        {btn.icon}

        {/* Pulse ring - staggered per button so they don't flash in sync */}
        <span
          className={`pointer-events-none absolute inset-0 rounded-full opacity-30 animate-ping ${btn.ringBg}`}
          style={{ animationDelay: `${btn.delay * 4}s`, animationDuration: '1.6s' }}
          aria-hidden="true"
        />
      </motion.a>
    </div>
  )
}
