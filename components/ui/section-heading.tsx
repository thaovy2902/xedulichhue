import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const sectionHeadingVariants = cva('flex flex-col', {
  variants: {
    align: {
      left:   'items-start text-left',
      center: 'items-center text-center',
      right:  'items-end text-right',
    },
    size: {
      sm:      'gap-2 max-w-xl',
      default: 'gap-3 max-w-2xl',
      lg:      'gap-4 max-w-3xl',
    },
  },
  defaultVariants: {
    align: 'center',
    size:  'default',
  },
})

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeadingVariants> {
  /** Small eyebrow label rendered above the title */
  label?: string
  /** Main heading text. A "\n" starts a new line. */
  title: string
  /** Render the first line of the title in the brand color */
  highlightFirstLine?: boolean
  /** Optional descriptive sub-copy below the title */
  description?: string
  /** HTML element for the title (default: h2) */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
  /** Accent color for the label pill */
  labelVariant?: 'primary' | 'secondary' | 'success' | 'neutral'
  /** Render the short orange accent line under the title (default: true) */
  accentLine?: boolean
}

/* ─── Label color map ────────────────────────────────────────────────────── */

const labelColorMap = {
  primary:   'bg-accent text-accent-foreground border border-primary/20',
  secondary: 'bg-secondary-50 text-secondary-700 border border-secondary/20 dark:bg-secondary/10 dark:text-secondary',
  success:   'bg-success-50 text-success-700 border border-success/20 dark:bg-success/10 dark:text-success',
  neutral:   'bg-muted text-muted-foreground border border-border',
}

/** Renders "\n" in the title as line breaks */
function renderTitle(title: string, highlightFirstLine?: boolean) {
  return title.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {highlightFirstLine && i === 0 ? <span className="text-primary">{line}</span> : line}
    </React.Fragment>
  ))
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function SectionHeading({
  className,
  align,
  size,
  label,
  title,
  highlightFirstLine,
  description,
  titleAs: Title = 'h2',
  labelVariant = 'primary',
  accentLine = true,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(sectionHeadingVariants({ align, size }), className)}
      {...props}
    >
      {/* Eyebrow label */}
      {label && (
        <span
          className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest',
            labelColorMap[labelVariant]
          )}
        >
          {label}
        </span>
      )}

      {/* Main title */}
      <Title
        className={cn(
          'font-bold tracking-tight text-heading leading-tight',
          size === 'sm'
            ? 'text-2xl sm:text-3xl'
            : size === 'lg'
            ? 'text-4xl sm:text-5xl'
            : 'text-3xl sm:text-4xl'
        )}
      >
        {renderTitle(title, highlightFirstLine)}
      </Title>

      {/* Accent line */}
      {accentLine && (
        <span className="block h-1 w-12 rounded-full bg-secondary" aria-hidden="true" />
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-muted-foreground leading-relaxed',
            size === 'sm' ? 'text-sm' : 'text-base sm:text-lg'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export { SectionHeading, sectionHeadingVariants }
