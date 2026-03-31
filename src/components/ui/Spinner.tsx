import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const spinnerVariants = cva('inline-block animate-spin rounded-full border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-[3px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export default function Spinner({ size, className, label = 'Cargando' }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2 text-slate-300" role="status" aria-live="polite">
      <span className={cn(spinnerVariants({ size }), className)} aria-hidden="true" />
      <span className="text-sm">{label}...</span>
    </span>
  )
}
