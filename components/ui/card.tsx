import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Root card variants ─────────────────────────────────────────────────── */

const cardVariants = cva(
  'relative flex flex-col rounded-xl bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default:  'shadow-card border border-border',
        elevated: 'shadow-elevated border-0',
        bordered: 'border-2 border-border shadow-none',
        ghost:    'border-0 shadow-none bg-transparent',
        primary:  'border border-primary/20 bg-accent shadow-card',
      },

      padding: {
        none: '',
        xs:   '[&>[data-slot=card-body]]:p-3',
        sm:   '[&>[data-slot=card-body]]:p-4',
        md:   '[&>[data-slot=card-body]]:p-6',
        lg:   '[&>[data-slot=card-body]]:p-8',
      },

      hoverable: {
        true:  'transition-shadow duration-200 hover:shadow-elevated cursor-pointer',
        false: '',
      },
    },

    defaultVariants: {
      variant:   'default',
      padding:   'md',
      hoverable: false,
    },
  }
)

/* ─── Card ───────────────────────────────────────────────────────────────── */

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({
  className,
  variant,
  padding,
  hoverable,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, hoverable }), className)}
      {...props}
    />
  )
}

/* ─── CardHeader ─────────────────────────────────────────────────────────── */

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-6 pb-0', className)}
      {...props}
    />
  )
}

/* ─── CardBody ───────────────────────────────────────────────────────────── */

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-body"
      className={cn('p-6', className)}
      {...props}
    />
  )
}

/* ─── CardFooter ─────────────────────────────────────────────────────────── */

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center p-6 pt-0',
        className
      )}
      {...props}
    />
  )
}

/* ─── CardTitle ──────────────────────────────────────────────────────────── */

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-bold leading-tight tracking-tight', className)}
      {...props}
    />
  )
}

/* ─── CardDescription ────────────────────────────────────────────────────── */

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
}

/* ─── CardImage ──────────────────────────────────────────────────────────── */

function CardImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="card-image"
      className={cn('w-full object-cover rounded-t-xl', className)}
      alt={props.alt ?? ''}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  CardImage,
  cardVariants,
}
