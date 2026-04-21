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
    <div className="flex flex-wrap gap-2">
      <ButtonCarbon variant="secondary" onClick={onPrev} disabled={!canPrev}>Anterior</ButtonCarbon>
      <ButtonCarbon onClick={onReveal}>{isRevealed ? 'Ocultar respuesta' : 'Revelar respuesta'}</ButtonCarbon>
      <ButtonCarbon variant="secondary" onClick={onNext} disabled={!canNext}>Siguiente</ButtonCarbon>
      <ButtonCarbon variant="ghost" onClick={onShuffle}>Barajar</ButtonCarbon>
    </div>
  )
}

export default memo(StudyControls)