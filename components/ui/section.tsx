import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Container, type containerVariants } from './container'
import type { VariantProps as CVAVariantProps } from 'class-variance-authority'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const sectionVariants = cva('', {
  variants: {
    /** Vertical padding presets */
    spacing: {
      none:    '',
      sm:      'py-10 md:py-14',
      default: 'py-16 md:py-24',
      lg:      'py-24 md:py-32',
      xl:      'py-32 md:py-40',
    },
    /** Background presets */
    bg: {
      none:      '',
      default:   'bg-background',
      muted:     'bg-muted',
      card:      'bg-card',
      accent:    'bg-accent',
      primary:   'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      dark:      'bg-neutral-900 text-white dark:bg-neutral-950',
    },
  },
  defaultVariants: {
    spacing: 'default',
    bg:      'none',
  },
})

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
  containerSize?: CVAVariantProps<typeof containerVariants>['size']
  containerClassName?: string
  /** When true, skips the Container wrapper */
  noContainer?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function Section({
  className,
  spacing,
  bg,
  as: Tag = 'section',
  containerSize,
  containerClassName,
  noContainer = false,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(sectionVariants({ spacing, bg }), className)}
      {...props}
    >
      {noContainer ? (
        children
      ) : (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  )
}

export { Section, sectionVariants }
