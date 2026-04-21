import type { ReactNode } from 'react'
import { Layer, Tile } from '@carbon/react'
import { cn } from '../../lib/cn'

interface CardCarbonProps {
  title?: string
  description?: string
  actions?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  contentClassName?: string
  variant?: 'default' | 'elevated' | 'bordered'
}

export default function CardCarbon({
  title,
  description,
  actions,
  footer,
  children,
  className = '',
  contentClassName = '',
  variant = 'default',
}: CardCarbonProps) {
  // Variantes visuales concentradas para evitar condicionales anidados.
  const variantClassByType: Record<NonNullable<CardCarbonProps['variant']>, string> = {
    default: 'border border-indigo-100 bg-indigo-50',
    elevated: 'border border-indigo-300 bg-indigo-100 shadow-sm shadow-indigo-200/40',
    bordered: 'border-2 border-indigo-200 bg-indigo-50',
  }

  return (
    <Tile className={cn(variantClassByType[variant], className)}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-indigo-900">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          {actions}
        </header>
      )}
      {children ? <section className={cn('text-slate-700', contentClassName)}>{children}</section> : null}
      {footer ? (
        <Layer className="mt-4 border-t border-indigo-200 pt-3">
          <footer>{footer}</footer>
        </Layer>
      ) : null}
    </Tile>
  )
}
