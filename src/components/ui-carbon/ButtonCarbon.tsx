import type { CSSProperties, ReactNode } from 'react'
import { Button as CarbonButton } from '@carbon/react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonCarbonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const KIND_BY_VARIANT: Record<Variant, React.ComponentProps<typeof CarbonButton>['kind']> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
  ghost: 'ghost',
}

const SIZE_BY_VARIANT: Record<Size, React.ComponentProps<typeof CarbonButton>['size']> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export default function ButtonCarbon({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  style,
  disabled,
  type = 'button',
  ...rest
}: ButtonCarbonProps) {
  // Mantiene un único punto de composición de estilos inline.
  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    width: fullWidth ? '100%' : style?.width,
  }

  return (
    <CarbonButton
      kind={KIND_BY_VARIANT[variant] ?? 'primary'}
      size={SIZE_BY_VARIANT[size] ?? 'md'}
      disabled={disabled || isLoading}
      renderIcon={rightIcon ? (() => <>{rightIcon}</>) : undefined}
      {...rest}
      type={type}
      className={cn('fl-button-carbon', className)}
      style={mergedStyle}
    >
      {leftIcon ? <span style={{ marginRight: 8, display: 'inline-flex' }}>{leftIcon}</span> : null}
      {isLoading ? 'Cargando...' : children}
    </CarbonButton>
  )
}