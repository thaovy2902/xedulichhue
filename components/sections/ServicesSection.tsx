'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Check, Phone } from 'lucide-react'
import { servicesData, type ServiceItem } from '@/data/services'
import { SectionHeading } from '@/components/ui/section-heading'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { PHONE_TEL } from '@/lib/site'

// ─── Animation config ──────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]
const SPRING = { type: 'spring', stiffness: 280, damping: 22 } as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0 } },
}

const cardIn: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const headingIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

// ─── Ripple button ─────────────────────────────────────────────────────────

interface Ripple { id: number; x: number; y: number; size: number }

interface RippleButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
}

function RippleButton({ label, className, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>) {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now() + Math.random()
    setRipples((prev) => [...prev, { id, x, y, size }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
  }

  return (
    <a
      href={PHONE_TEL}
      onPointerDown={handlePointerDown}
      className={cn(
        'relative overflow-hidden select-none',
        'flex items-center justify-center gap-2',
        'w-full h-9 sm:h-11 rounded-lg sm:rounded-xl',
        'bg-primary text-primary-foreground text-[13px] sm:text-sm font-semibold',
        'transition-colors duration-150 hover:bg-primary-800 active:bg-primary-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
      {label}

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'linear' }}
          aria-hidden="true"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          className="absolute rounded-full bg-white pointer-events-none"
        />
      ))}
    </a>
  )
}

// ─── Service card ──────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: ServiceItem
  title: string
  features: string[]
  ctaLabel: string
}

function ServiceCard({ service, title, features, ctaLabel }: ServiceCardProps) {
  return (
    // Outer motion.div carries the stagger variant
    <motion.div variants={cardIn}>
      {/* Inner motion.div handles hover - isolated so it doesn't conflict with variant transition */}
      <motion.div
        whileHover={{ y: -8, scale: 1.025 }}
        transition={SPRING}
        className="group flex flex-row sm:flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-card sm:hover:shadow-2xl h-full"
      >
        {/* ── Image area ─────────────────────────────────────────────── */}
        <div
          className="relative w-[38%] sm:w-auto sm:h-56 overflow-hidden shrink-0"
          style={{ background: service.gradient }}
        >
          {/* Decorative oversized icon - visible when no real image */}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <service.Icon className="w-16 h-16 sm:w-28 sm:h-28 text-white/15" strokeWidth={1} />
          </div>

          {/*
            Real image - place at /public/images/services/{service.id}.jpg
            Recommended: 600 × 450 px, WebP preferred.
          */}
          <Image
            src={`/images/services/${service.id}.jpg`}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Mobile: image left, details right. sm+: stacked. */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* ── Title bar ──────────────────────────────────────────────── */}
          <div className="bg-secondary px-3 py-2 sm:px-5 sm:py-3">
            <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2">
              {title}
            </h3>
          </div>

          {/* ── Content ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 p-3 sm:gap-5 sm:p-5 flex-1">
            {/* Feature list */}
            <ul className="flex flex-col gap-1.5 sm:gap-2 flex-1">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 sm:gap-2.5">
                  <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success/10 shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success" aria-hidden="true" />
                  </span>
                  <span className="text-[13px] sm:text-[15px] font-medium text-foreground leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <RippleButton label={ctaLabel} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── ServicesSection ───────────────────────────────────────────────────────

export function ServicesSection() {
  const t = useTranslations('services')

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={sectionRef} className="py-16 md:py-24 bg-background">
      <Container>
        {/* Heading */}
        <motion.div
          variants={headingIn}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="flex justify-center mb-12"
        >
          <SectionHeading
            label={t('badge')}
            title={t('title')}
            description={t('subtitle')}
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        >
          {servicesData.map((service) => {
            const title = t(`items.${service.id}.title` as Parameters<typeof t>[0])
            const features = Array.from({ length: service.featureCount }, (_, i) =>
              t(`items.${service.id}.feature${i}` as Parameters<typeof t>[0])
            )
            return (
              <ServiceCard
                key={service.id}
                service={service}
                title={title}
                features={features}
                ctaLabel={t('cta')}
              />
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
