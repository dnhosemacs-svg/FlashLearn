// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/70 disabled:cursor-not-allowed disabled:opacity-60'
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-800',
  }
  const widthClass = fullWidth ? 'w-full' : ''
  const composedClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`.trim()

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={composedClassName}
      {...rest}
    >
      {leftIcon}
      {isLoading ? 'Cargando...' : children}
      {rightIcon}
    </button>
  )
}