import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const alertVariants = cva('rounded-lg border p-3 text-sm', {
  variants: {
    variant: {
      info: 'border-indigo-300 bg-indigo-50 text-indigo-800',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      warning: 'border-amber-300 bg-amber-50 text-amber-800',
      danger: 'border-red-300 bg-red-50 text-red-800',
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
    <div className={cn(alertVariants({ variant }), className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <p>{children}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
