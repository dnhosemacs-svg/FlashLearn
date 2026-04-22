import { useEffect, type ReactNode } from 'react'
import { ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react'
import { cn } from '../../lib/cn'
import ButtonCarbon from './ButtonCarbon'

interface ModalCarbonProps {
  open: boolean
  title?: string
  description?: string
  children?: ReactNode
  onClose: () => void
  footer?: ReactNode
  closeOnBackdrop?: boolean
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export default function ModalCarbon({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  closeOnBackdrop = true,
  className,
  size = 'sm',
}: ModalCarbonProps) {
  useEffect(() => {
    // Cierre por teclado para mantener paridad con comportamiento esperado de diálogos.
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <ComposedModal
      open={open}
      onClose={onClose}
      preventCloseOnClickOutside={!closeOnBackdrop}
      size={size}
      className={cn('fl-modal-carbon', className)}
    >
      <ModalHeader title={title ?? 'Dialogo'} label={description ?? ''} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {footer ?? (
          <ButtonCarbon type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </ButtonCarbon>
        )}
      </ModalFooter>
    </ComposedModal>
  )
}
