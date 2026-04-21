import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-slate-200 text-slate-800',
        info: 'bg-blue-100 text-blue-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-rose-100 text-rose-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string
  className?: string
}

export default function Badge({ label, variant, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{label}</span>
}
