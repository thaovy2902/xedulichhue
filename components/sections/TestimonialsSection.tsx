'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Star, ExternalLink } from 'lucide-react'
import { testimonialsData, type Testimonial } from '@/data/testimonials'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'
import { MAP_REVIEWS_URL } from '@/lib/site'

// ─── Animation ─────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// ─── Name decoding ─────────────────────────────────────────────────────────
// Names are kept out of the server-rendered HTML (see data/testimonials.ts)
// and decoded only in the browser, inside a data-nosnippet element.

function decodeName(encoded: string) {
  const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function useDecodedNames(items: Testimonial[]) {
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only decode by design
    setNames(Object.fromEntries(items.map((item) => [item.id, decodeName(item.nameEncoded)])))
  }, [items])

  return names
}

// ─── TestimonialsSection ───────────────────────────────────────────────────

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const names = useDecodedNames(testimonialsData)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-12 md:py-16 bg-accent/60"
    >
      <Container>
        {/* Mobile: heading above a swipeable row. sm+: heading is the first masonry tile. */}
        <SectionHeading
          label={t('badge')}
          title={t('title')}
          description={t('subtitle')}
          align="left"
          size="sm"
          className="mb-6 sm:hidden"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="-mx-4 px-4 grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:pb-0 sm:block sm:columns-2 lg:columns-3 sm:overflow-visible"
        >
          {/* Heading card */}
          <motion.div variants={fadeUp} className="hidden sm:block break-inside-avoid mb-4 px-1 pt-1 pb-4">
            <SectionHeading
              label={t('badge')}
              title={t('title')}
              description={t('subtitle')}
              align="left"
              size="sm"
              titleAs="h3"
            />
          </motion.div>

          {testimonialsData.map((item) => (
            <motion.div key={item.id} variants={fadeUp} className="snap-start break-inside-avoid sm:mb-4">
              <ReviewCard item={item} name={names[item.id]} label={t('customer')} />
            </motion.div>
          ))}
        </motion.div>

        {/* See more on Google Maps */}
        <div className="mt-4 flex justify-center">
          <a
            href={MAP_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary transition-colors hover:bg-primary/90"
          >
            {t('more')}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  )
}

// ─── Cards ─────────────────────────────────────────────────────────────────

interface CardProps {
  item: Testimonial
  name: string | undefined
  label: string
}

const cardBase =
  'rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow duration-300'

function ReviewCard({ item, name, label }: CardProps) {
  return (
    <figure className={cn(cardBase, 'flex h-full flex-col p-4 sm:h-auto sm:p-5')}>
      <Stars rating={item.rating} />
      <blockquote className="mt-3 flex-1 text-sm text-foreground/80 leading-relaxed">
        {item.quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar src={item.avatar} className="h-9 w-9" />
        <Author name={name} label={label} />
      </figcaption>
    </figure>
  )
}

// ─── Bits ──────────────────────────────────────────────────────────────────

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn('flex gap-1', className)} role="img" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-gold text-gold' : 'text-neutral-300',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external Google avatar, decorative
    <img
      src={src}
      alt=""
      width={56}
      height={56}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={cn('shrink-0 rounded-full object-cover bg-muted', className)}
    />
  )
}

function Author({ name, label }: { name: string | undefined; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-foreground min-h-[1.25rem]" data-nosnippet>
        {name}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
