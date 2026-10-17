'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import type { ComponentProps } from 'react'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const navbarLinkVariants = cva(
  [
    'inline-flex items-center gap-2 font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'rounded-md',
  ],
  {
    variants: {
      variant: {
        /** Standard header nav */
        default:
          'text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 text-sm',
        /** Active state for the current page */
        active:
          'text-primary bg-accent px-3 py-2 text-sm font-semibold',
        /** Pill style */
        pill:
          'text-muted-foreground hover:text-primary hover:bg-accent px-4 py-1.5 text-sm rounded-full',
        'pill-active':
          'text-primary-foreground bg-primary px-4 py-1.5 text-sm font-semibold rounded-full',
        /** Underline style */
        underline:
          'text-muted-foreground hover:text-primary pb-0.5 border-b-2 border-transparent hover:border-primary text-sm rounded-none',
        'underline-active':
          'text-primary pb-0.5 border-b-2 border-primary text-sm font-semibold rounded-none',
        /** Sidebar / vertical nav */
        sidebar:
          'text-muted-foreground hover:text-primary hover:bg-accent w-full px-3 py-2 text-sm',
        'sidebar-active':
          'text-primary bg-accent w-full px-3 py-2 text-sm font-semibold border-l-2 border-primary rounded-l-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface NavbarLinkProps
  extends Omit<ComponentProps<typeof Link>, 'href'>,
    VariantProps<typeof navbarLinkVariants> {
  href: string
  isActive?: boolean
  icon?: React.ReactNode
  badge?: string | number
  /** Override variant with explicit active variant when isActive=true */
  activeVariant?: VariantProps<typeof navbarLinkVariants>['variant']
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function NavbarLink({
  className,
  href,
  variant = 'default',
  isActive = false,
  icon,
  badge,
  activeVariant,
  children,
  ...props
}: NavbarLinkProps) {
  // Determine the resolved variant
  const resolvedVariant = isActive
    ? activeVariant ?? deriveActiveVariant(variant)
    : variant

  return (
    <Link
      href={href}
      className={cn(navbarLinkVariants({ variant: resolvedVariant }), className)}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'ml-auto inline-flex items-center justify-center rounded-full text-xs font-semibold min-w-[1.25rem] h-5 px-1.5',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function deriveActiveVariant(
  variant: VariantProps<typeof navbarLinkVariants>['variant']
): VariantProps<typeof navbarLinkVariants>['variant'] {
  const map: Record<string, VariantProps<typeof navbarLinkVariants>['variant']> = {
    default:   'active',
    pill:      'pill-active',
    underline: 'underline-active',
    sidebar:   'sidebar-active',
  }
  return map[variant ?? 'default'] ?? 'active'
}

export { NavbarLink, navbarLinkVariants }
