import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FlashcardForm from '../components/features/flashcards/FlashcardForm'
import FlashcardList from '../components/features/flashcards/FlashcardList'
import type { CreateFlashcardInput, Flashcard } from '../types/domain'

const FLASHCARDS_STORAGE_KEY = 'flashlearn.flashcards'

function loadStoredFlashcards(): Flashcard[] {
  const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>(loadStoredFlashcards)

  const flashcards = useMemo(
    () => allFlashcards.filter((card) => card.collectionId === collectionId),
    [allFlashcards, collectionId],
  )

  useEffect(() => {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(allFlashcards))
  }, [allFlashcards])

  const handleCreateFlashcard = (data: CreateFlashcardInput) => {
    if (!collectionId) return
  
    const now = new Date().toISOString()
    const newFlashcard: Flashcard = {
      id: crypto.randomUUID(),
      collectionId,
      question: data.question,
      answer: data.answer,
      tags: data.tags,
      createdAt: now,
      updatedAt: now,
    }
  
    setAllFlashcards((prev) => [newFlashcard, ...prev])
  }
  
  const handleDeleteFlashcard = (flashcardId: string) => {
    setAllFlashcards((prev) => prev.filter((card) => card.id !== flashcardId))
  }
  
  const handleEditFlashcard = (flashcardId: string) => {
    console.log(`Editar flashcard: ${flashcardId}`)
  }

  if (!collectionId) {
    return (
      <main className="page-shell">
        <EmptyState
          title="Colección no válida"
          description="No se encontró un identificador de colección en la URL."
        />
        <div className="mt-4">
          <Link to="/collections">
            <Button variant="ghost">Volver a colecciones</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Detalle de colección</h1>
          <p className="page-subtitle">ID: {collectionId}</p>
        </div>
        <Link to="/collections">
          <Button variant="ghost">Volver</Button>
        </Link>
      </div>

      <section className="card-grid-2">
        <FlashcardForm onSubmit={handleCreateFlashcard} />

        <Card
          title="Tarjetas de la colección"
          description="Listado de flashcards creadas en esta colección."
        >
          <FlashcardList
            flashcards={flashcards}
            onEditFlashcard={handleEditFlashcard}
            onDeleteFlashcard={handleDeleteFlashcard}
          />
        </Card>
      </section>
    </main>
  )
}