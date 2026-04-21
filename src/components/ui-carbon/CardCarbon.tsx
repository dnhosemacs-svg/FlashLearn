import type { ReactNode } from 'react'
import { Layer, Tile } from '@carbon/react'

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
  const variantClass =
    variant === 'elevated'
      ? 'border border-indigo-300 bg-indigo-100 shadow-sm shadow-indigo-200/40'
      : variant === 'bordered'
        ? 'border-2 border-indigo-200 bg-indigo-50'
        : 'border border-indigo-100 bg-indigo-50'

  return (
    <Tile className={`${variantClass} ${className}`.trim()}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-indigo-900">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          {actions}
        </header>
      )}
      {children ? <section className={`text-slate-700 ${contentClassName}`.trim()}>{children}</section> : null}
      {footer ? (
        <Layer className="mt-4 border-t border-indigo-200 pt-3">
          <footer>{footer}</footer>
        </Layer>
      ) : null}
    </Tile>
  )
}
