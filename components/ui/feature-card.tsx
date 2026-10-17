import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { IconBox, type IconBoxProps } from './icon-box'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const featureCardVariants = cva(
  'group flex flex-col rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'bg-card border border-border shadow-card hover:shadow-elevated p-6',
        bordered:
          'border-2 border-border bg-transparent p-6 hover:border-primary',
        ghost:
          'bg-transparent p-6 hover:bg-muted',
        elevated:
          'bg-card shadow-elevated border-0 p-6 hover:shadow-xl',
        accent:
          'bg-accent border border-primary/20 p-6 hover:shadow-card',
      },

      layout: {
        /** Icon on top, text below */
        vertical:   'items-start gap-4',
        /** Icon on the left, text on the right */
        horizontal: 'flex-row items-start gap-5',
      },
    },

    defaultVariants: {
      variant: 'default',
      layout:  'vertical',
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {
  icon: React.ReactNode
  title: string
  description?: string
  /** Extra content (links, buttons) placed after description */
  footer?: React.ReactNode
  /** Forwarded to IconBox */
  iconVariant?: IconBoxProps['variant']
  iconSize?: IconBoxProps['size']
  iconRounded?: IconBoxProps['rounded']
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function FeatureCard({
  className,
  variant,
  layout,
  icon,
  title,
  description,
  footer,
  iconVariant = 'primary',
  iconSize = 'default',
  iconRounded = 'md',
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(featureCardVariants({ variant, layout }), className)}
      {...props}
    >
      <IconBox
        icon={icon}
        variant={iconVariant}
        size={iconSize}
        rounded={iconRounded}
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      />

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-bold leading-snug text-card-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {footer && (
          <div className="mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export { FeatureCard, featureCardVariants }
