import type { HTMLAttributes, ReactNode } from 'react'

// Tipos base reutilizables para componentes presentacionales.
export interface BaseUIProps {
  className?: string
  children?: ReactNode
}

export interface UIContentProps extends BaseUIProps {
  title?: string
  description?: string
}

export type DivProps = HTMLAttributes<HTMLDivElement>
