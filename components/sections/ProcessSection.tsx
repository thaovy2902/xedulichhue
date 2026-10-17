'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { PhoneCall, CalendarCheck, UserCheck, Navigation } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

// ─── Step config ───────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]
const SPRING = { type: 'spring', stiffness: 280, damping: 22 } as const

interface StepConfig {
  number: 1 | 2 | 3 | 4
  Icon: LucideIcon
  /** Tailwind bg class for the large circle */
  circleBg: string
  /** Tailwind bg class for the step-number badge */
  badgeBg: string
}

const STEPS: StepConfig[] = [
  { number: 1, Icon: PhoneCall,     circleBg: 'bg-primary',   badgeBg: 'bg-secondary' },
  { number: 2, Icon: CalendarCheck, circleBg: 'bg-secondary', badgeBg: 'bg-primary'   },
  { number: 3, Icon: UserCheck,     circleBg: 'bg-success',   badgeBg: 'bg-secondary' },
  { number: 4, Icon: Navigation,    circleBg: 'bg-primary-700', badgeBg: 'bg-secondary' },
]

// ─── ProcessSection ────────────────────────────────────────────────────────

export function ProcessSection() {
  const t = useTranslations('process')

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-16 md:py-24 bg-muted/30 overflow-hidden"
    >
      <Container>
        {/* ── Heading ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex justify-center mb-16"
        >
          <SectionHeading
            label={t('badge')}
            title={t('title')}
            description={t('subtitle')}
          />
        </motion.div>

        {/* ── Desktop: Horizontal timeline (lg+) ─────────────────────── */}
        <ol className="hidden lg:block list-none m-0 p-0" aria-label={t('title')}>
          <div className="relative">
            {/* Track line (background) */}
            <div
              aria-hidden="true"
              className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-border"
            />
            {/* Animated progress line */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.0, ease: EASE, delay: 0.4 }}
              style={{ originX: 0 }}
              className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary"
            />

            {/* Steps grid */}
            <div className="grid grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <DesktopStep
                  key={step.number}
                  step={step}
                  index={i}
                  isInView={isInView}
                  title={t(`step${step.number}.title` as Parameters<typeof t>[0])}
                  desc={t.rich(`step${step.number}.desc` as Parameters<typeof t.rich>[0], { b: bold, form: formLink })}
                  stepLabel={t('step')}
                />
              ))}
            </div>
          </div>
        </ol>

        {/* ── Mobile: Vertical timeline (< lg) ───────────────────────── */}
        <ol className="lg:hidden flex flex-col list-none m-0 p-0" aria-label={t('title')}>
          {STEPS.map((step, i) => (
            <MobileStep
              key={step.number}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
              isInView={isInView}
              title={t(`step${step.number}.title` as Parameters<typeof t>[0])}
              desc={t.rich(`step${step.number}.desc` as Parameters<typeof t.rich>[0], { b: bold, form: formLink })}
              stepLabel={t('step')}
            />
          ))}
        </ol>
      </Container>
    </section>
  )
}

// ─── Desktop step ──────────────────────────────────────────────────────────

interface StepProps {
  step: StepConfig
  index: number
  isInView: boolean
  title: string
  desc: ReactNode
  stepLabel: string
}

function DesktopStep({ step, index, isInView, title, desc, stepLabel }: StepProps) {
  const delay = index * 0.15 + 0.3

  return (
    <li className="flex flex-col items-center gap-5 relative">
      {/* Circle with icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ ...SPRING, delay }}
        className="relative z-10 shrink-0"
      >
        <div
          className={cn(
            'flex items-center justify-center w-20 h-20 rounded-full text-white shadow-lg',
            step.circleBg,
          )}
        >
          <step.Icon className="w-8 h-8" strokeWidth={1.75} />
        </div>
        {/* Step-number badge */}
        <span
          className={cn(
            'absolute -top-1.5 -right-1.5 flex items-center justify-center',
            'w-6 h-6 rounded-full text-[11px] font-bold text-white shadow-sm',
            step.badgeBg,
          )}
        >
          {step.number}
        </span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: EASE, delay: delay + 0.1 }}
        className="w-full flex-1 flex flex-col bg-card border border-border rounded-2xl p-5 text-center shadow-card hover:shadow-elevated transition-shadow duration-200"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
          {stepLabel} {step.number}
        </p>
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed text-balance">{desc}</p>
      </motion.div>
    </li>
  )
}

const bold = (chunks: ReactNode) => (
  <strong className="font-semibold text-foreground">{chunks}</strong>
)

const formLink = (chunks: ReactNode) => (
  <a href="#booking" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
    {chunks}
  </a>
)

// ─── Mobile step ───────────────────────────────────────────────────────────

interface MobileStepProps extends StepProps { isLast: boolean }

function MobileStep({ step, index, isLast, isInView, title, desc, stepLabel }: MobileStepProps) {
  const delay = index * 0.15 + 0.2

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="flex gap-5"
    >
      {/* Left column: circle + connector */}
      <div className="flex flex-col items-center shrink-0">
        {/* Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ ...SPRING, delay }}
          className="relative"
        >
          <div
            className={cn(
              'flex items-center justify-center w-14 h-14 rounded-full text-white shadow-md',
              step.circleBg,
            )}
          >
            <step.Icon className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <span
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center',
              'w-5 h-5 rounded-full text-[10px] font-bold text-white',
              step.badgeBg,
            )}
          >
            {step.number}
          </span>
        </motion.div>

        {/* Vertical connector line */}
        {!isLast && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: delay + 0.3 }}
            style={{ originY: 0 }}
            className="w-0.5 flex-1 bg-border my-2 min-h-[40px]"
          />
        )}
      </div>

      {/* Right column: card */}
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {stepLabel} {step.number}
          </p>
          <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">{desc}</p>
        </div>
      </div>
    </motion.li>
  )
}
