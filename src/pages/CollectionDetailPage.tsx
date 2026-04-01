import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FlashcardForm from '../components/features/flashcards/FlashcardForm'
import FlashcardList from '../components/features/flashcards/FlashcardList'
import type { CreateFlashcardInput, Flashcard } from '../types/domain'

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

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
  
    setFlashcards((prev) => [newFlashcard, ...prev])
  }
  
  const handleDeleteFlashcard = (flashcardId: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== flashcardId))
  }
  
  const handleEditFlashcard = (flashcardId: string) => {
    console.log(`Editar flashcard: ${flashcardId}`)
  }

  if (!collectionId) {
    return (
      <main className="min-h-screen p-8">
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
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Detalle de colección</h1>
          <p className="mt-2 text-slate-300">ID: {collectionId}</p>
        </div>
        <Link to="/collections">
          <Button variant="ghost">Volver</Button>
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
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