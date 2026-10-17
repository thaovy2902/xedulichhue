import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const iconBoxVariants = cva(
  'inline-flex items-center justify-center shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-primary',
        'primary-solid':
          'bg-primary text-primary-foreground',
        secondary:
          'bg-secondary-50 text-secondary-600 dark:bg-secondary/10 dark:text-secondary',
        'secondary-solid':
          'bg-secondary text-secondary-foreground',
        success:
          'bg-success-50 text-success-600 dark:bg-success/10 dark:text-success',
        'success-solid':
          'bg-success text-success-foreground',
        warning:
          'bg-warning-50 text-warning-700 dark:bg-warning/10 dark:text-warning',
        muted:
          'bg-muted text-muted-foreground',
        neutral:
          'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
      },

      size: {
        xs:      'h-8  w-8  [&>svg]:h-4 [&>svg]:w-4',
        sm:      'h-10 w-10 [&>svg]:h-5 [&>svg]:w-5',
        default: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
        lg:      'h-14 w-14 [&>svg]:h-7 [&>svg]:w-7',
        xl:      'h-16 w-16 [&>svg]:h-8 [&>svg]:w-8',
      },

      rounded: {
        md:   'rounded-xl',
        lg:   'rounded-2xl',
        full: 'rounded-full',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size:    'default',
      rounded: 'md',
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface IconBoxProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconBoxVariants> {
  icon: React.ReactNode
  /** Accessible label for screen readers */
  label?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function IconBox({
  className,
  variant,
  size,
  rounded,
  icon,
  label,
  ...props
}: IconBoxProps) {
  return (
    <span
      className={cn(iconBoxVariants({ variant, size, rounded }), className)}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    >
      {icon}
    </span>
  )
}

export { IconBox, iconBoxVariants }
