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
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const flashcards = useMemo(
    () => allFlashcards.filter((card) => card.collectionId === collectionId),
    [allFlashcards, collectionId],
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredFlashcards = useMemo(() => {
    if (!normalizedQuery) return flashcards

    return flashcards.filter((card) => {
      const question = card.question.toLowerCase()
      const answer = card.answer.toLowerCase()
      const tags = (card.tags ?? []).join(' ').toLowerCase()

      return (
        question.includes(normalizedQuery) ||
        answer.includes(normalizedQuery) ||
        tags.includes(normalizedQuery)
      )
    })
  }, [flashcards, normalizedQuery])

  const flashcardsStats = useMemo(() => {
    const total = flashcards.length
    const withTags = flashcards.filter((card) => (card.tags?.length ?? 0) > 0).length
    const withoutTags = total - withTags
  
    return { total, withTags, withoutTags }
  }, [flashcards])

  useEffect(() => {
    setAllFlashcards(loadStoredFlashcards())
  }, [])

  useEffect(() => {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(allFlashcards))
  }, [allFlashcards])

  useEffect(() => {
    setSearchQuery('')
  }, [collectionId])

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

      <div className="mt-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar por pregunta, respuesta o tags..."
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Total: {flashcardsStats.total} | Con tags: {flashcardsStats.withTags} | Sin tags: {flashcardsStats.withoutTags}.
      </p>

      <section className="section-stack">
        <div className="card-grid-2">
          <FlashcardForm onSubmit={handleCreateFlashcard} />

          <Card
            title="Tarjetas de la colección"
            description="Listado de flashcards creadas en esta colección."
          >
            <FlashcardList
              flashcards={filteredFlashcards}
              onEditFlashcard={handleEditFlashcard}
              onDeleteFlashcard={handleDeleteFlashcard}
            />
          </Card>
        </div>
      </section>
    </main>
  )
}