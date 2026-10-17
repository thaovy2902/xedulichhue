import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Variants ───────────────────────────────────────────────────────────── */

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm:      'max-w-3xl',
      md:      'max-w-5xl',
      default: 'max-w-7xl',
      lg:      'max-w-screen-2xl',
      full:    'max-w-none',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

/* ─── Component ──────────────────────────────────────────────────────────── */

function Container({
  className,
  size,
  as: Tag = 'div',
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
}

export { Container, containerVariants }
