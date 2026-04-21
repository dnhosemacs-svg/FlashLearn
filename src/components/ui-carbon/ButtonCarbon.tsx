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

function mapKind(variant: Variant): React.ComponentProps<typeof CarbonButton>['kind'] {
  switch (variant) {
    case 'primary':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'danger':
      return 'danger'
    case 'ghost':
      return 'ghost'
    default:
      return 'primary'
  }
}

function mapSize(size: Size): React.ComponentProps<typeof CarbonButton>['size'] {
  switch (size) {
    case 'sm':
      return 'sm'
    case 'md':
      return 'md'
    case 'lg':
      return 'lg'
    default:
      return 'md'
  }
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
  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    width: fullWidth ? '100%' : style?.width,
  }

  return (
    <CarbonButton
      kind={mapKind(variant)}
      size={mapSize(size)}
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