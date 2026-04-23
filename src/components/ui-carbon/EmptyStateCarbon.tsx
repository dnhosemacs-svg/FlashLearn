import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface EmptyStateCarbonProps {
  title?: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export default function EmptyStateCarbon({
  title,
  description,
  action,
  icon,
  className = '',
}: EmptyStateCarbonProps) {
  return (
    <section className={cn('fl-empty-state text-center', className)}>
      {icon ? <div className="mb-3 flex justify-center text-[var(--fl-heading)]">{icon}</div> : null}
      <h2 className="text-xl font-semibold text-[var(--fl-heading)]">{title ?? 'Sin datos'}</h2>
      {description ? <p className="mt-2 text-sm text-[var(--fl-text-muted)]">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
