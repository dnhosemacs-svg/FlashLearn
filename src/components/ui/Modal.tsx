import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import Button from './Button'

interface ModalProps {
  open: boolean
  title?: string
  description?: string
  children?: ReactNode
  onClose: () => void
  footer?: ReactNode
  closeOnBackdrop?: boolean
  className?: string
}

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm"
        onClick={() => {
          if (closeOnBackdrop) onClose()
        }}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Dialogo'}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-indigo-300 bg-indigo-50 p-5 shadow-xl shadow-indigo-200/40',
          className,
        )}
      >
        {(title || description) && (
          <header className="mb-4">
            {title && <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          </header>
        )}

        <div className="text-slate-700">{children}</div>

        <footer className="mt-5 flex flex-wrap justify-end gap-2">
          {footer ?? (
            <Button type="button" variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </footer>
      </section>
    </div>
  )
}
