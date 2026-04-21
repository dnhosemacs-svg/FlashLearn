import { useEffect, type ReactNode } from 'react'
import { ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react'
import ButtonCarbon from './ButtonCarbon'

interface ModalCarbonProps {
  open: boolean
  title?: string
  description?: string
  children?: ReactNode
  onClose: () => void
  footer?: ReactNode
  closeOnBackdrop?: boolean
}

export default function ModalCarbon({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  closeOnBackdrop = true,
}: ModalCarbonProps) {
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
    <ComposedModal
      open={open}
      onClose={onClose}
      preventCloseOnClickOutside={!closeOnBackdrop}
      size="sm"
      className="fl-modal-carbon"
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
