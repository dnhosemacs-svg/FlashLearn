import type { HTMLAttributes, ReactNode } from 'react'

export interface BaseUIProps {
  className?: string
  children?: ReactNode
}

export interface UIContentProps extends BaseUIProps {
  title?: string
  description?: string
}

export type DivProps = HTMLAttributes<HTMLDivElement>
