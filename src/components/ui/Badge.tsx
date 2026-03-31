import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-slate-700 text-slate-100',
        info: 'bg-indigo-500/20 text-indigo-300',
        success: 'bg-emerald-500/20 text-emerald-300',
        warning: 'bg-amber-500/20 text-amber-300',
        danger: 'bg-rose-500/20 text-rose-300',
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
