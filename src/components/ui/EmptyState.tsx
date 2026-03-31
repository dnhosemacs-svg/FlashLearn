import type { ReactNode } from 'react'
import type { UIContentProps } from '../../types/ui'

interface EmptyStateProps extends UIContentProps {
  action?: ReactNode
  icon?: ReactNode
  variant?: 'default' | 'subtle'
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  const variantClasses = {
    default: 'border border-dashed border-slate-700 bg-slate-900/60',
    subtle: 'border border-slate-800 bg-slate-900/30',
  }

  return (
    <section className={`rounded-xl p-8 text-center ${variantClasses[variant]} ${className}`.trim()}>
      {icon && <div className="mb-3 flex justify-center text-slate-300">{icon}</div>}
      {title && <h2 className="text-xl font-semibold text-slate-100">{title}</h2>}
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}