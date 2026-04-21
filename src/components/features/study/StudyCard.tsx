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
          <p className="text-xs uppercase tracking-wide text-slate-500">Pregunta</p>
          <p className="mt-1 text-base font-medium text-slate-800">{flashcard.question}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Respuesta</p>
          {/* La respuesta se protege hasta que el usuario decide revelarla. */}
          {isRevealed ? (
            <p className="mt-1 text-base text-slate-700">{flashcard.answer}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">Pulsa "Revelar respuesta" para verla.</p>
          )}
        </div>
      </div>
    </CardCarbon>
  )
}