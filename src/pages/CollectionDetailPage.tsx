import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FlashcardForm from '../components/features/flashcards/FlashcardForm'
import FlashcardList from '../components/features/flashcards/FlashcardList'
import Spinner from '../components/ui/Spinner'
import { useFlashcardsContext } from '../context/FlashcardsContext'
import type { CreateFlashcardInput } from '../types/domain'
import {useNavigate} from 'react-router-dom'

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const { allFlashcards, network, refresh, createForCollection, update, remove } = useFlashcardsContext()
  const [editingFlashcardId, setEditingFlashcardId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const flashcards = useMemo(
    () => (collectionId ? allFlashcards.filter((card) => card.collectionId === collectionId) : []),
    [allFlashcards, collectionId],
  )
  const editingFlashcard = flashcards.find((card) => card.id === editingFlashcardId)

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
    setSearchQuery('')
  }, [collectionId])

  const handleEditFlashcard = useCallback((flashcardId: string) => {
    setEditingFlashcardId(flashcardId)
  }, [])

  const handleUpdateFlashcard = useCallback(
    (data: CreateFlashcardInput) => {
      if (!editingFlashcardId) return
      update(editingFlashcardId, data)
      setEditingFlashcardId(null)
    },
    [editingFlashcardId, update],
  )

  const handleCancelEditFlashcard = useCallback(() => {
    setEditingFlashcardId(null)
  }, [])

  const handleCreateFlashcard = useCallback(
    (data: CreateFlashcardInput) => {
      if (!collectionId) return
      createForCollection(collectionId, data)
    },
    [collectionId, createForCollection],
  )

  if (!collectionId) {
    return (
      <main className="page-shell">
        <EmptyState
          title="Colección no válida"
          description="No se encontró un identificador de colección en la URL."
        />
        <div className="mt-4">
            <Button variant="ghost" onClick={() => navigate('/collections')}>Volver a colecciones</Button>
        </div>
      </main>
    )
  }

  if (network.status === 'loading' && flashcards.length === 0) {
    return (
      <main className="page-shell">
        <div className="page-header">
          <h1 className="page-title">Detalle de colección</h1>
          <Link to="/collections">
            <Button variant="ghost">Volver</Button>
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <Spinner label="Cargando tarjetas" />
        </div>
      </main>
    )
  }

  if (network.status === 'error') {
    return (
      <main className="page-shell">
        <div className="page-header">
          <h1 className="page-title">Detalle de colección</h1>
          <Link to="/collections">
            <Button variant="ghost">Volver</Button>
          </Link>
        </div>
        <EmptyState
          title="No se pudieron cargar las tarjetas"
          description={network.error ?? 'Error desconocido'}
          action={
            <Button type="button" onClick={() => void refresh()}>
              Reintentar
            </Button>
          }
        />
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
        {editingFlashcard ? (
  <FlashcardForm
    mode="edit"
    initialValues={{
      question: editingFlashcard.question,
      answer: editingFlashcard.answer,
      tags: editingFlashcard.tags,
    }}
    submitLabel="Guardar cambios"
    onSubmit={handleUpdateFlashcard}
    onCancel={handleCancelEditFlashcard}
  />
) : (
  <FlashcardForm onSubmit={handleCreateFlashcard} />
)}

          <Card
            title="Tarjetas de la colección"
            description="Listado de flashcards creadas en esta colección."
          >
            <FlashcardList
              flashcards={filteredFlashcards}
              onEditFlashcard={handleEditFlashcard}
              onDeleteFlashcard={remove}
            />
          </Card>
        </div>
      </section>
    </main>
  )
}
