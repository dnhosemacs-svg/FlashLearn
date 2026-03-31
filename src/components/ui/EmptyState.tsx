import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import type { UIContentProps } from '../../types/ui'

const emptyStateVariants = cva('rounded-xl p-8 text-center', {
  variants: {
    variant: {
      default: 'border border-dashed border-slate-700 bg-slate-900/60',
      subtle: 'border border-slate-800 bg-slate-900/30',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface EmptyStateProps extends UIContentProps, VariantProps<typeof emptyStateVariants> {
  action?: ReactNode
  icon?: ReactNode
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  return (
    <section className={cn(emptyStateVariants({ variant }), className)}>
      {icon && <div className="mb-3 flex justify-center text-slate-300">{icon}</div>}
      {title && <h2 className="text-xl font-semibold text-slate-100">{title}</h2>}
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}