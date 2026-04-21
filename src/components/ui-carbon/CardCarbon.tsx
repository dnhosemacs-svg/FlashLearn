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
      ? 'shadow-sm'
      : variant === 'bordered'
        ? 'border-2 border-[#c6c6c6]'
        : ''

  return (
    <Tile className={`${variantClass} ${className}`.trim()}>
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-[#161616]">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-[#525252]">{description}</p> : null}
          </div>
          {actions}
        </header>
      )}
      {children ? <section className={contentClassName}>{children}</section> : null}
      {footer ? (
        <Layer className="mt-4 border-t border-[#e0e0e0] pt-3">
          <footer>{footer}</footer>
        </Layer>
      ) : null}
    </Tile>
  )
}
