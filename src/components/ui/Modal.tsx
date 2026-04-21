import { useEffect, useId, useRef, type ReactNode } from 'react'
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
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === dialogRef.current) {
          event.preventDefault()
          lastElement.focus()
        }
        return
      }

      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    triggerRef.current?.focus()
  }, [open])

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
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : 'Dialogo'}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-indigo-300 bg-indigo-50 p-5 shadow-xl shadow-indigo-200/40',
          className,
        )}
      >
        {(title || description) && (
          <header className="mb-4">
            {title && (
              <h3 id={titleId} className="text-lg font-semibold text-indigo-900">
                {title}
              </h3>
            )}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-slate-600">
                {description}
              </p>
            )}
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
