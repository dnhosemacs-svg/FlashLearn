import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-[var(--fl-surface-accent)] text-[var(--fl-heading)]',
        info: 'bg-[var(--fl-surface)] text-[var(--fl-heading)]',
        success:
          'bg-[var(--fl-success-bg)] text-[var(--fl-success-text)] border border-[var(--fl-success-border)]',
        warning:
          'bg-[var(--fl-warning-bg)] text-[var(--fl-warning-text)] border border-[var(--fl-warning-border)]',
        danger:
          'bg-[var(--fl-danger-bg)] text-[var(--fl-danger-text)] border border-[var(--fl-danger-border)]',
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
  // Badge simple para etiquetar estado/categoría sin comportamiento interactivo.
  return <span className={cn(badgeVariants({ variant }), className)}>{label}</span>
}
