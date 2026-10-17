'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { CarFront, ClockCheck, Wallet, Headphones } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'

// ─── Animation ─────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]
const SPRING = { type: 'spring', stiffness: 280, damping: 22 } as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// ─── Feature data ──────────────────────────────────────────────────────────

interface Feature {
  key: 'vehicle' | 'onTime' | 'price' | 'support'
  Icon: LucideIcon
  /** Tailwind bg class for the icon circle */
  iconBg: string
  /** Tailwind text class for the icon */
  iconColor: string
  /** Tailwind bg class for the subtle card tint on hover */
  accentBg: string
}

const FEATURES: Feature[] = [
  {
    key: 'vehicle',
    Icon: CarFront,
    iconBg: 'bg-primary',
    iconColor: 'text-white',
    accentBg: 'hover:bg-accent',
  },
  {
    key: 'onTime',
    Icon: ClockCheck,
    iconBg: 'bg-primary',
    iconColor: 'text-white',
    accentBg: 'hover:bg-accent',
  },
  {
    key: 'price',
    Icon: Wallet,
    iconBg: 'bg-primary',
    iconColor: 'text-white',
    accentBg: 'hover:bg-accent',
  },
  {
    key: 'support',
    Icon: Headphones,
    iconBg: 'bg-primary',
    iconColor: 'text-white',
    accentBg: 'hover:bg-accent',
  },
]

// ─── WhyUsSection ──────────────────────────────────────────────────────────

export function WhyUsSection() {
  const t = useTranslations('whyUs')

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="py-16 md:py-24 bg-background"
    >
      <Container>
        <div className="flex flex-col gap-14">

          {/* ── Heading block ─────────────────────────────────────────── */}
          <motion.div
            variants={headingVariant}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="flex justify-center"
          >
            <SectionHeading
              label={t('badge')}
              title={`${t('heading1')}\n${t('heading2')}`}
              highlightFirstLine
              description={t('subtitle')}
              className="max-w-3xl"
            />
          </motion.div>

          {/* ── Feature cards ─────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.key}
                feature={feature}
                title={t(`features.${feature.key}.title` as Parameters<typeof t>[0])}
                desc={t(`features.${feature.key}.desc` as Parameters<typeof t>[0])}
              />
            ))}
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

// ─── FeatureCard ───────────────────────────────────────────────────────────

interface FeatureCardProps {
  feature: Feature
  title: string
  desc: string
}

function FeatureCard({ feature, title, desc }: FeatureCardProps) {
  return (
    <motion.div variants={cardVariant}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={SPRING}
        className={cn(
          'group flex flex-row items-start text-left gap-4 rounded-2xl p-4 h-full',
          'sm:flex-col sm:items-center sm:text-center sm:p-6',
          'bg-card border border-border shadow-card',
          'hover:shadow-elevated hover:border-primary/25',
          'transition-[border-color,box-shadow] duration-300',
          feature.accentBg,
        )}
      >
        {/* Icon circle */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: -6 }}
          transition={SPRING}
          className={cn(
            'flex items-center justify-center',
            'w-12 h-12 sm:w-16 sm:h-16 rounded-full shrink-0',
            feature.iconBg,
            'shadow-primary/30 shadow-md',
          )}
        >
          <feature.Icon
            className={cn('w-5 h-5 sm:w-7 sm:h-7', feature.iconColor)}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </motion.div>

        <div className="flex flex-col gap-1 sm:gap-4">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-primary leading-snug text-balance sm:min-h-[2lh] sm:flex sm:items-center sm:justify-center">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed sm:text-balance">
            {desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
