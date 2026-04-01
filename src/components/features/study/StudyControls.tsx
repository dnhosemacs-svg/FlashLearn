import Button from '../../ui/Button'

interface StudyControlsProps {
  onPrev: () => void
  onNext: () => void
  onReveal: () => void
  onShuffle: () => void
  canPrev: boolean
  canNext: boolean
  isRevealed: boolean
}

export default function StudyControls({
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
      <Button variant="secondary" onClick={onPrev} disabled={!canPrev}>Anterior</Button>
      <Button onClick={onReveal}>{isRevealed ? 'Ocultar respuesta' : 'Revelar respuesta'}</Button>
      <Button variant="secondary" onClick={onNext} disabled={!canNext}>Siguiente</Button>
      <Button variant="ghost" onClick={onShuffle}>Barajar</Button>
    </div>
  )
}