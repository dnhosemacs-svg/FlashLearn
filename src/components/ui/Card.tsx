import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import type { UIContentProps } from '../../types/ui'

const cardVariants = cva('rounded-xl p-4', {
  variants: {
    variant: {
      default: 'border border-indigo-200 bg-indigo-100',
      elevated: 'border border-indigo-300 bg-indigo-100 shadow-sm shadow-indigo-200/40',
      bordered: 'border-2 border-indigo-300 bg-indigo-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface CardProps extends UIContentProps, VariantProps<typeof cardVariants> {
  actions?: ReactNode
  footer?: ReactNode
  contentClassName?: string
}

export default function Card({
  title,
  description,
  actions,
  footer,
  children,
  variant = 'default',
  contentClassName = '',
  className = '',
}: CardProps) {
  return (
    <article className={cn(cardVariants({ variant }), className)}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children && <section className={cn('text-slate-700', contentClassName)}>{children}</section>}
      {footer && <footer className="mt-4 border-t border-indigo-200 pt-3">{footer}</footer>}
    </article>
  )
}