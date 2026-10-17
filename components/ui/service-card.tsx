import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { Badge } from './badge'
import { IconBox, type IconBoxProps } from './icon-box'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const serviceCardVariants = cva(
  'group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-card border border-border shadow-card hover:shadow-elevated hover:-translate-y-0.5',
        elevated:
          'bg-card shadow-elevated border-0 hover:shadow-xl hover:-translate-y-1',
        bordered:
          'border-2 border-border bg-transparent hover:border-primary hover:bg-accent',
        accent:
          'bg-accent border border-primary/20 hover:shadow-elevated hover:-translate-y-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface ServiceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof serviceCardVariants> {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  /** Optional small label (e.g. "Popular", "New") */
  badge?: string
  /** Optional image URL shown at the top of the card */
  image?: string
  imageAlt?: string
  /** Label for the CTA arrow link */
  ctaLabel?: string
  /** Forwarded to IconBox */
  iconVariant?: IconBoxProps['variant']
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function ServiceCard({
  className,
  variant,
  icon,
  title,
  description,
  href,
  badge,
  image,
  imageAlt,
  ctaLabel,
  iconVariant = 'primary',
  ...props
}: ServiceCardProps) {
  return (
    <div
      className={cn(serviceCardVariants({ variant }), className)}
      {...props}
    >
      {/* Image (optional) */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" rounded="full" size="sm">
                {badge}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Badge (when no image) */}
        {badge && !image && (
          <Badge variant="soft-secondary" rounded="full" size="sm" className="self-start">
            {badge}
          </Badge>
        )}

        {/* Icon + title row */}
        <div className="flex items-start gap-4">
          <IconBox
            icon={icon}
            variant={iconVariant}
            size="default"
            rounded="md"
            className="shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <h3 className="text-lg font-bold leading-snug text-card-foreground pt-1.5">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>

        {/* CTA link */}
        <Link
          href={href}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-semibold text-primary',
            'transition-all duration-200',
            'hover:gap-2.5 hover:text-primary-800 dark:hover:text-primary',
            'focus-visible:outline-none focus-visible:underline'
          )}
          aria-label={ctaLabel ?? title}
        >
          {ctaLabel ?? 'Learn more'}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}

export { ServiceCard, serviceCardVariants }
