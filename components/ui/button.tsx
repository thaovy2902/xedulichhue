import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  // Base
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap font-semibold rounded-lg',
    'transition-all duration-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ],
  {
    variants: {
      variant: {
        /* Filled */
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-800 active:bg-primary-900 shadow-sm hover:shadow-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-secondary',
        success:
          'bg-success text-success-foreground hover:bg-success-700 active:bg-success-800 shadow-sm',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-sm',

        /* Outlined */
        'outline-primary':
          'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground active:bg-primary-800',
        'outline-secondary':
          'border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground active:bg-secondary-600',
        outline:
          'border border-border text-foreground bg-transparent hover:bg-muted active:bg-muted/70',

        /* Soft / tinted */
        soft:
          'bg-accent text-accent-foreground hover:bg-primary/15 active:bg-primary/20',
        'soft-secondary':
          'bg-secondary-50 text-secondary-700 hover:bg-secondary-100 active:bg-secondary-200 dark:bg-secondary/10 dark:text-secondary dark:hover:bg-secondary/20',

        /* Ghost / link */
        ghost:
          'text-foreground hover:bg-muted active:bg-muted/70',
        link:
          'text-primary underline-offset-4 hover:underline px-0',
      },

      size: {
        xs:      'h-7  px-2.5 text-xs  gap-1.5',
        sm:      'h-8  px-3   text-sm  gap-1.5',
        default: 'h-10 px-4   text-sm',
        lg:      'h-11 px-6   text-base',
        xl:      'h-12 px-8   text-base',
        icon:    'h-10 w-10   text-sm',
        'icon-sm':'h-8 w-8    text-sm',
        'icon-lg':'h-12 w-12  text-base',
      },

      rounded: {
        default: '',           // inherits base rounded-lg
        full:    'rounded-full',
        none:    'rounded-none',
      },

      width: {
        auto:  '',
        full:  'w-full',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size:    'default',
      rounded: 'default',
      width:   'auto',
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, renders as a slot - pass an anchor/Link as the only child.
   * The slot merges className and aria attributes onto the child element.
   */
  asChild?: boolean
  /** Optional loading state - disables the button and renders a spinner */
  loading?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      width,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      buttonVariants({ variant, size, rounded, width }),
      className
    )

    // asChild: clone the single child and spread our props/classes onto it
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: cn(
            classes,
            (children as React.ReactElement<{ className?: string }>).props.className
          ),
        }
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
