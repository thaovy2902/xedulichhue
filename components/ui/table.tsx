import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* ─── Root table wrapper ─────────────────────────────────────────────────── */

const tableVariants = cva(
  'w-full text-sm text-left',
  {
    variants: {
      variant: {
        default:  '',
        bordered: '[&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border',
        striped:  '[&_tbody_tr:nth-child(odd)]:bg-muted/40',
      },
      size: {
        sm:      '[&_th]:py-2    [&_th]:px-3 [&_td]:py-2    [&_td]:px-3    text-xs',
        default: '[&_th]:py-3    [&_th]:px-4 [&_td]:py-3.5  [&_td]:px-4',
        lg:      '[&_th]:py-4    [&_th]:px-6 [&_td]:py-4    [&_td]:px-6    text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  }
)

/* ─── Table ──────────────────────────────────────────────────────────────── */

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Wraps the table in a scrollable container */
  scrollable?: boolean
  /** Optional accessible caption */
  caption?: string
}

function Table({
  className,
  variant,
  size,
  scrollable = true,
  caption,
  children,
  ...props
}: TableProps) {
  const table = (
    <table
      className={cn(tableVariants({ variant, size }), className)}
      {...props}
    >
      {caption && <caption className="mb-2 text-sm text-muted-foreground">{caption}</caption>}
      {children}
    </table>
  )

  if (scrollable) {
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-border">
        {table}
      </div>
    )
  }

  return table
}

/* ─── TableHead ──────────────────────────────────────────────────────────── */

function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-muted/60 text-muted-foreground border-b border-border', className)}
      {...props}
    />
  )
}

/* ─── TableBody ──────────────────────────────────────────────────────────── */

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        'divide-y divide-border bg-card',
        '[&_tr:last-child]:border-0',
        '[&_tr]:transition-colors [&_tr]:duration-100',
        '[&_tr:hover]:bg-muted/50',
        className
      )}
      {...props}
    />
  )
}

/* ─── TableFoot ──────────────────────────────────────────────────────────── */

function TableFoot({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn('border-t border-border bg-muted/40 font-medium', className)}
      {...props}
    />
  )
}

/* ─── TableRow ───────────────────────────────────────────────────────────── */

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-b border-border last:border-0', className)} {...props} />
  )
}

/* ─── TableHeader (th) ───────────────────────────────────────────────────── */

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
}

function TableHeader({
  className,
  sortable,
  sorted,
  children,
  ...props
}: TableHeaderProps) {
  return (
    <th
      className={cn(
        'py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
        sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
        className
      )}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {sortable && (
          <svg
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              sorted === 'asc' && 'rotate-180',
              !sorted && 'opacity-40'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    </th>
  )
}

/* ─── TableCell (td) ─────────────────────────────────────────────────────── */

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('py-3.5 px-4 text-card-foreground', className)}
      {...props}
    />
  )
}

/* ─── TableCaption ───────────────────────────────────────────────────────── */

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn('mt-2 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

/* ─── TableEmpty ─────────────────────────────────────────────────────────── */

function TableEmpty({ message = 'No data available' }: { message?: string }) {
  return (
    <tr>
      <td colSpan={999} className="py-12 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  )
}

export {
  Table,
  TableHead,
  TableBody,
  TableFoot,
  TableRow,
  TableHeader,
  TableCell,
  TableCaption,
  TableEmpty,
  tableVariants,
}
