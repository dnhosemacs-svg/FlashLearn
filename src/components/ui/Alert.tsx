import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const alertVariants = cva('rounded-lg border p-3 text-sm', {
  variants: {
    variant: {
      info: 'border-[var(--fl-border)] bg-[var(--fl-surface)] text-[var(--fl-text)]',
      success:
        'border-[var(--fl-success-border)] bg-[var(--fl-success-bg)] text-[var(--fl-success-text)]',
      warning:
        'border-[var(--fl-warning-border)] bg-[var(--fl-warning-bg)] text-[var(--fl-warning-text)]',
      danger: 'border-[var(--fl-danger-border)] bg-[var(--fl-danger-bg)] text-[var(--fl-danger-text)]',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function Alert({ variant = 'info', children, action, className = '' }: AlertProps) {
  return (
    // role cambia según severidad para mejorar accesibilidad con lectores de pantalla.
    <div className={cn(alertVariants({ variant }), className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <p>{children}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
