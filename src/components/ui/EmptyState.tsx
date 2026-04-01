import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import type { UIContentProps } from '../../types/ui'

const emptyStateVariants = cva('rounded-xl p-8 text-center', {
  variants: {
    variant: {
      default: 'border border-dashed border-indigo-300 bg-indigo-50',
      subtle: 'border border-indigo-200 bg-indigo-100/50',
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
      {icon && <div className="mb-3 flex justify-center text-indigo-700">{icon}</div>}
      {title && <h2 className="text-xl font-semibold text-indigo-900">{title}</h2>}
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}