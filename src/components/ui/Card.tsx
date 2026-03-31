import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import type { UIContentProps } from '../../types/ui'

const cardVariants = cva('rounded-xl p-4', {
  variants: {
    variant: {
      default: 'border border-slate-800 bg-slate-900',
      elevated: 'border border-slate-800 bg-slate-900 shadow-lg shadow-black/20',
      bordered: 'border-2 border-slate-700 bg-slate-950',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface CardProps extends UIContentProps, VariantProps<typeof cardVariants> {
  actions?: ReactNode
}

export default function Card({
  title,
  description,
  actions,
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  return (
    <article className={cn(cardVariants({ variant }), className)}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children && <section className="text-slate-200">{children}</section>}
    </article>
  )
}