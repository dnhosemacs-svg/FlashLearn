import type { CSSProperties, ReactNode } from 'react'
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
    default: 'rounded-xl border p-4',
    elevated: 'rounded-xl border p-4 shadow-sm',
    bordered: 'rounded-xl border-2 p-4',
  }

  const variantStyleByType: Record<NonNullable<CardCarbonProps['variant']>, CSSProperties> = {
    default: {
      borderColor: 'var(--fl-border)',
      backgroundColor: 'var(--fl-surface-strong)',
    },
    elevated: {
      borderColor: 'var(--fl-border-strong)',
      backgroundColor: 'var(--fl-surface-strong)',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.16)',
    },
    bordered: {
      borderColor: 'var(--fl-border-strong)',
      backgroundColor: 'var(--fl-surface)',
    },
  }

  return (
    <Tile className={cn(variantClassByType[variant], className)} style={variantStyleByType[variant]}>
      {/* Encabezado opcional para título + acciones contextuales. */}
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-[var(--fl-heading)]">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-[var(--fl-text-muted)]">{description}</p> : null}
          </div>
          {actions}
        </header>
      )}
      {children ? <section className={cn('text-[var(--fl-text-soft)]', contentClassName)}>{children}</section> : null}
      {/* Footer aislado en Layer para respetar jerarquía visual de Carbon. */}
      {footer ? (
        <Layer className="mt-4 border-t pt-3" style={{ borderTopColor: 'var(--fl-border)' }}>
          <footer>{footer}</footer>
        </Layer>
      ) : null}
    </Tile>
  )
}
