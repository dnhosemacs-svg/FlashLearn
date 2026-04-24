import CardCarbon from '../../ui-carbon/CardCarbon'
import type { Flashcard } from '../../../types/domain'

interface StudyCardProps {
  flashcard: Flashcard
  isRevealed: boolean
}

export default function StudyCard({ flashcard, isRevealed }: StudyCardProps) {
  return (
    <CardCarbon
      title="Modo estudio"
      description="Lee la pregunta e intenta responder antes de revelar."
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--fl-text-muted)]">Pregunta</p>
          <p className="mt-1 text-base font-medium text-[var(--fl-text)]">{flashcard.question}</p>
        </div>

        <div className="surface-item" style={{ padding: '0.5rem 0.75rem' }}>
          <p className="text-xs uppercase tracking-wide text-[var(--fl-text-muted)]">Respuesta</p>
          {/* La respuesta se protege hasta que el usuario decide revelarla. */}
          {isRevealed ? (
            <p className="mt-1 text-base text-[var(--fl-text-soft)]">{flashcard.answer}</p>
          ) : (
            <p className="mt-1 text-sm text-[var(--fl-text-muted)]">Pulsa "Revelar respuesta" para verla.</p>
          )}
        </div>
      </div>
    </CardCarbon>
  )
}