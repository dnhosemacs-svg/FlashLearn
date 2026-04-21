import type { ReactNode } from 'react'
import { InlineNotification } from '@carbon/react'

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
    // Estado vacío reutilizable: mensaje principal + contenido opcional (icono/acción).
    <section className={className}>
      <InlineNotification
        kind="info"
        lowContrast
        hideCloseButton
        title={title ?? 'Sin datos'}
        subtitle={description}
      />
      {icon ? <div className="mt-3 flex justify-center">{icon}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
