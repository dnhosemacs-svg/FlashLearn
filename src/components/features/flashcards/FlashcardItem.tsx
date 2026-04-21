import { memo } from 'react'
import Badge from '../../ui/Badge'
import ButtonCarbon from '../../ui-carbon/ButtonCarbon'
import CardCarbon from '../../ui-carbon/CardCarbon'
import type { Flashcard } from '../../../types/domain'

interface FlashcardItemProps {
  flashcard: Flashcard
  onEdit: (flashcardId: string) => void
  onDelete: (flashcardId: string) => void
}

function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  return (
    <CardCarbon
      title={flashcard.question}
      description="Tarjeta de estudio"
      actions={
        <div className="flex gap-2">
          <ButtonCarbon variant="ghost" size="sm" onClick={() => onEdit(flashcard.id)}>
            Editar
          </ButtonCarbon>
          <ButtonCarbon variant="danger" size="sm" onClick={() => onDelete(flashcard.id)}>
            Borrar
          </ButtonCarbon>
        </div>
      }
    >
      <p className="text-sm text-slate-700">{flashcard.answer}</p>

      {/* Se renderizan tags solo cuando existen para evitar ruido visual. */}
      {flashcard.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="info" />
          ))}
        </div>
      ) : null}
    </CardCarbon>
  )
}

export default memo(FlashcardItem)
