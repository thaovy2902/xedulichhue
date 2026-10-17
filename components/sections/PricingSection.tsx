'use client'

import { useState, useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, BadgeCheck } from 'lucide-react'
import { pricingData } from '@/data/pricing'
import { SectionHeading } from '@/components/ui/section-heading'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

// ─── Animations ────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// ─── PricingSection ────────────────────────────────────────────────────────

export function PricingSection() {
  const t = useTranslations('pricing')
  const [query, setQuery] = useState('')

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const filtered = pricingData.filter((row) =>
    row.route.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-16 md:py-24 bg-muted/30"
    >
      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="flex flex-col gap-8"
        >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-5"
        >
          <SectionHeading
            label={t('badge')}
            title={t('title')}
            description={t('subtitle')}
          />

          {/* Highlight callout */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/25 max-w-xl text-center">
            <BadgeCheck className="w-5 h-5 text-secondary shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-secondary leading-snug">
              {t('highlight')}
            </span>
          </div>
        </motion.div>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              className={cn(
                'w-full h-11 pl-10 pr-4 rounded-xl',
                'border border-border bg-background text-sm text-foreground',
                'placeholder:text-muted-foreground',
                'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
                'transition-shadow duration-150',
              )}
              aria-label={t('search')}
            />
          </div>
        </motion.div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          {/*
            Outer: overflow-hidden + rounded corners clip visual edges.
            Inner: overflow-auto + max-h creates the scroll container - sticky
            thead will stick to the TOP of this scroll container.
          */}
          <div className="rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[540px]">
              <table className="w-full min-w-[560px] border-collapse">

                {/* ─ Sticky header ─────────────────────────────────────── */}
                <thead>
                  <tr>
                    {[
                      { key: 'route', align: 'left'  },
                      { key: 'car4',  align: 'right' },
                      { key: 'car7',  align: 'right' },
                      { key: 'car16', align: 'right' },
                    ].map((col, i) => (
                      <th
                        key={col.key}
                        scope="col"
                        className={cn(
                          'sticky top-0 z-10',
                          'bg-primary text-primary-foreground',
                          'px-5 py-3.5 text-sm font-semibold whitespace-nowrap',
                          'border-b border-primary-800',
                          col.align === 'right' ? 'text-right' : 'text-left',
                          i === 0 && 'rounded-tl-none', // handled by outer wrapper
                        )}
                      >
                        {t(`col.${col.key}` as Parameters<typeof t>[0])}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* ─ Body ──────────────────────────────────────────────── */}
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        {t('empty')}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={cn(
                          'group transition-colors duration-100',
                          idx % 2 === 0
                            ? 'bg-background'
                            : 'bg-muted/30',
                          'hover:bg-accent/60',
                        )}
                      >
                        {/* Route */}
                        <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span>{row.route}</span>
                            {row.popular && (
                              <span className="inline-flex shrink-0 items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-secondary/15 text-secondary border border-secondary/25">
                                {t('popular')}
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Prices */}
                        <td className="px-5 py-3.5 text-sm font-semibold text-right text-primary tabular-nums">
                          {row.car4}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-right text-foreground tabular-nums">
                          {row.car7}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-right text-foreground tabular-nums">
                          {row.car16}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t('note')}
          </p>
        </motion.div>

        </motion.div>{/* end stagger */}
      </Container>
    </section>
  )
}
