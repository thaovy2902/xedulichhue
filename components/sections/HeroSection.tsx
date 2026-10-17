'use client'

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Phone, ArrowRight,
  Clock, Tag, Sparkles, BadgePercent, Users,
  Plane, MapPin, Navigation,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

// ─── Variants ─────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// ─── FloatingCard ─────────────────────────────────────────────────────────

interface FloatingCardProps {
  icon: React.ElementType
  label: string
  delay?: number
  className?: string
  iconBg?: string
  /** When true, skips adding `absolute z-20` - use inside a positioned wrapper */
  withoutPosition?: boolean
}

function FloatingCard({ icon: Icon, label, delay = 0, className, iconBg, withoutPosition }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(!withoutPosition && 'absolute z-20', className)}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
          delay: delay + 0.5,
        }}
        className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-white/30 shadow-elevated"
      >
        <span className={cn('flex items-center justify-center w-7 h-7 rounded-xl shrink-0', iconBg)}>
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </motion.div>
  )
}

// ─── Ring config ───────────────────────────────────────────────────────────

const RING_CARDS = [
  { Icon: Clock,        key: 'floating.support',     iconBg: 'bg-primary/15 text-primary'   },
  { Icon: Tag,          key: 'floating.price',        iconBg: 'bg-success/15 text-success'   },
  { Icon: Sparkles,     key: 'floating.vehicle',      iconBg: 'bg-secondary/15 text-secondary' },
  { Icon: BadgePercent, key: 'floating.competitive',  iconBg: 'bg-primary/15 text-primary'   },
  { Icon: Users,        key: 'floating.team',         iconBg: 'bg-success/15 text-success'   },
] as const

// Compute (x, y) on a circle for each card.
// Container size: 400×400. Center: (200, 200). Radius: 155px.
// Start at top (−90°), step 72° clockwise.
const RING_SIZE = 400
const RING_CENTER = RING_SIZE / 2
const RING_RADIUS = 155

function getRingPos(index: number) {
  const angleDeg = index * (360 / RING_CARDS.length) - 90
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    left: RING_CENTER + RING_RADIUS * Math.cos(angleRad),
    top:  RING_CENTER + RING_RADIUS * Math.sin(angleRad),
  }
}

// ─── HeroSection ──────────────────────────────────────────────────────────

export function HeroSection() {
  const t = useTranslations('hero')

  const routes = [
    { Icon: Plane,      label: t('route1') },
    { Icon: MapPin,     label: t('route2') },
    { Icon: Navigation, label: t('route3') },
  ]

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-svh flex items-end lg:items-center"
    >
      {/* ── Background image ─────────────────────────────────────────────── */}
      <Image
        src="/images/xe-du-lich-hue.png"
        alt={t('imageAlt')}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-neutral-950/85 via-neutral-950/55 to-neutral-950/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-neutral-950/60 to-transparent"
      />

      {/* ── Floating cards ring (desktop only) ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute hidden lg:block z-20"
        style={{
          top: '50%',
          right: '6%',
          transform: 'translateY(-50%)',
          width: RING_SIZE,
          height: RING_SIZE,
        }}
      >
        {RING_CARDS.map((card, i) => {
          const { left, top } = getRingPos(i)
          return (
            <div
              key={card.key}
              className="absolute"
              style={{ left, top, transform: 'translate(-50%, -50%)' }}
            >
              <FloatingCard
                icon={card.Icon}
                label={t(card.key as Parameters<typeof t>[0])}
                delay={1.0 + i * 0.15}
                iconBg={card.iconBg}
                withoutPosition
              />
            </div>
          )
        })}
      </div>

      {/* ── Text content ─────────────────────────────────────────────────── */}
      <Container className="relative z-10 w-full py-16 lg:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 max-w-xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" aria-hidden="true" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp} className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {t('title')}
              <br />
              <span className="text-gold">{t('seats')}</span>
            </h1>
          </motion.div>

          {/* Routes */}
          <motion.ul variants={fadeUp} className="flex flex-col gap-2">
            {routes.map(({ label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 shrink-0">
                  <Check className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                </span>
                <span className="text-white/90 font-medium">{label}</span>
              </li>
            ))}
          </motion.ul>

          {/* Description */}
          <motion.p variants={fadeUp} className="text-white/70 leading-relaxed">
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" rounded="full">
              <a href="#booking">
                <Phone className="w-4 h-4" />
                {t('cta.primary')}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              rounded="full"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white hover:border-white/60"
            >
              <a href="#pricing">
                {t('cta.secondary')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
