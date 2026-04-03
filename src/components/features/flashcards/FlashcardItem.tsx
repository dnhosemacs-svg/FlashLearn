import { memo } from 'react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import type { Flashcard } from '../../../types/domain'

interface FlashcardItemProps {
  flashcard: Flashcard
  onEdit: (flashcardId: string) => void
  onDelete: (flashcardId: string) => void
}

function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  return (
    <Card
      title={flashcard.question}
      description="Tarjeta de estudio"
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(flashcard.id)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(flashcard.id)}>
            Borrar
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">{flashcard.answer}</p>

      {flashcard.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="info" />
          ))}
        </div>
      ) : null}
    </Card>
  )
}

export default memo(FlashcardItem)
