import type { ReactNode } from 'react'
import type { UIContentProps } from '../../types/ui'

interface CardProps extends UIContentProps {
  actions?: ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
}

export default function Card({
  title,
  description,
  actions,
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const variantClasses = {
    default: 'border border-slate-800 bg-slate-900',
    elevated: 'border border-slate-800 bg-slate-900 shadow-lg shadow-black/20',
    bordered: 'border-2 border-slate-700 bg-slate-950',
  }

  return (
    <article className={`rounded-xl p-4 ${variantClasses[variant]} ${className}`.trim()}>
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