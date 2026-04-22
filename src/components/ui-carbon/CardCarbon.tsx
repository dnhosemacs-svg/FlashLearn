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
    default: 'rounded-xl border border-indigo-200 bg-indigo-100 p-4',
    elevated: 'rounded-xl border border-indigo-300 bg-indigo-100 p-4 shadow-sm shadow-indigo-200/40',
    bordered: 'rounded-xl border-2 border-indigo-300 bg-indigo-50 p-4',
  }

  return (
    <Tile className={cn(variantClassByType[variant], className)}>
      {/* Encabezado opcional para título + acciones contextuales. */}
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
      {/* Footer aislado en Layer para respetar jerarquía visual de Carbon. */}
      {footer ? (
        <Layer className="mt-4 border-t border-indigo-200 pt-3">
          <footer>{footer}</footer>
        </Layer>
      ) : null}
    </Tile>
  )
}
