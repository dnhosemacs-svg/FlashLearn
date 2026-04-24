import { memo } from 'react'
import ButtonCarbon from '../../ui-carbon/ButtonCarbon'

interface StudyControlsProps {
  onPrev: () => void
  onNext: () => void
  onReveal: () => void
  onShuffle: () => void
  canPrev: boolean
  canNext: boolean
  isRevealed: boolean
}

function StudyControls({
  onPrev,
  onNext,
  onReveal,
  onShuffle,
  canPrev,
  canNext,
  isRevealed,
}: StudyControlsProps) {
  return (
    // Controles de navegación del mazo y visibilidad de respuesta.
    <div className="flex flex-wrap gap-2">
      <ButtonCarbon className="fl-button-center-text" variant="secondary" onClick={onPrev} disabled={!canPrev}>Anterior</ButtonCarbon>
      <ButtonCarbon className="fl-button-center-text" onClick={onReveal}>{isRevealed ? 'Ocultar respuesta' : 'Revelar respuesta'}</ButtonCarbon>
      <ButtonCarbon className="fl-button-center-text" variant="secondary" onClick={onNext} disabled={!canNext}>Siguiente</ButtonCarbon>
      <ButtonCarbon className="fl-button-center-text" variant="ghost" onClick={onShuffle}>Barajar</ButtonCarbon>
    </div>
  )
}

export default memo(StudyControls)