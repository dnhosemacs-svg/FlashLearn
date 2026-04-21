import { memo } from 'react'
import EmptyStateCarbon from '../../ui-carbon/EmptyStateCarbon'
import type { Flashcard } from '../../../types/domain'
import FlashcardItem from './FlashcardItem'

interface FlashcardListProps {
  flashcards: Flashcard[]
  onEditFlashcard: (flashcardId: string) => void
  onDeleteFlashcard: (flashcardId: string) => void
}

function FlashcardList({ flashcards, onEditFlashcard, onDeleteFlashcard }: FlashcardListProps) {
  if (!flashcards.length) {
    return <EmptyStateCarbon title="No hay flashcards" description="Crea la primera tarjeta de esta colección." />
  }

  return (
    <section className="grid gap-4">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onEdit={onEditFlashcard}
          onDelete={onDeleteFlashcard}
        />
      ))}
    </section>
  )
}

export default memo(FlashcardList)