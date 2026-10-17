import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-colors',
  {
    variants: {
      variant: {
        /* Solid */
        primary:
          'bg-primary text-primary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground',
        success:
          'bg-success text-success-foreground',
        warning:
          'bg-warning text-warning-foreground',
        destructive:
          'bg-destructive text-destructive-foreground',
        neutral:
          'bg-neutral-600 text-white dark:bg-neutral-500',

        /* Soft / tinted */
        'soft-primary':
          'bg-primary-50 text-primary-700 dark:bg-primary/10 dark:text-primary',
        'soft-secondary':
          'bg-secondary-50 text-secondary-700 dark:bg-secondary/10 dark:text-secondary',
        'soft-success':
          'bg-success-50 text-success-700 dark:bg-success/10 dark:text-success',
        'soft-warning':
          'bg-warning-50 text-warning-700 dark:bg-warning/10 dark:text-warning',
        'soft-destructive':
          'bg-red-50 text-red-700 dark:bg-destructive/10 dark:text-destructive',
        'soft-neutral':
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',

        /* Outlined */
        'outline-primary':
          'border border-primary text-primary bg-transparent',
        'outline-secondary':
          'border border-secondary text-secondary bg-transparent',
        outline:
          'border border-border text-muted-foreground bg-transparent',
      },

      size: {
        sm:      'px-2    py-0.5 text-xs  rounded-md',
        default: 'px-2.5  py-1   text-xs  rounded-md',
        lg:      'px-3    py-1   text-sm  rounded-lg',
      },

      rounded: {
        default: '',
        full:    'rounded-full',
      },

      dot: {
        true:  '',
        false: '',
      },
    },

    defaultVariants: {
      variant: 'soft-primary',
      size:    'default',
      rounded: 'default',
      dot:     false,
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Render a colored dot before the label */
  dot?: boolean
}

/* ─── Dot color map ──────────────────────────────────────────────────────── */

const dotColorMap: Record<string, string> = {
  primary:           'bg-primary-foreground',
  secondary:         'bg-secondary-foreground',
  success:           'bg-success-foreground',
  warning:           'bg-warning-foreground',
  destructive:       'bg-destructive-foreground',
  neutral:           'bg-white',
  'soft-primary':    'bg-primary',
  'soft-secondary':  'bg-secondary',
  'soft-success':    'bg-success',
  'soft-warning':    'bg-warning',
  'soft-destructive':'bg-destructive',
  'soft-neutral':    'bg-neutral-500',
  'outline-primary': 'bg-primary',
  'outline-secondary':'bg-secondary',
  outline:           'bg-muted-foreground',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function Badge({
  className,
  variant,
  size,
  rounded,
  dot,
  children,
  ...props
}: BadgeProps) {
  const resolvedVariant = variant ?? 'soft-primary'

  return (
    <span
      className={cn(
        badgeVariants({ variant: resolvedVariant, size, rounded, dot }),
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full shrink-0',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            dotColorMap[resolvedVariant] ?? 'bg-current'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
