import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FlashcardForm from '../components/features/flashcards/FlashcardForm'
import FlashcardList from '../components/features/flashcards/FlashcardList'
import Skeleton from '../components/ui/Skeleton'
import { useCollectionsContext } from '../context/useCollectionsContext'
import { useFlashcardsContext } from '../context/useFlashcardsContext'
import type { CreateFlashcardInput } from '../types/domain'

const UUID_AT_END_REGEX =
  /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

export default function CollectionDetailPage() {
  const { collectionRef } = useParams<{ collectionRef: string }>()
  const { allFlashcards, network, refresh, createForCollection, update, remove } = useFlashcardsContext()
  const { collections } = useCollectionsContext()
  const [editingFlashcardId, setEditingFlashcardId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [lastFailedAction, setLastFailedAction] = useState<(() => Promise<void>) | null>(null)
  const navigate = useNavigate()

  const collectionId = useMemo(() => {
    if (!collectionRef) return undefined
    const match = collectionRef.match(UUID_AT_END_REGEX)
    return match?.[1] ?? collectionRef
  }, [collectionRef])

  const flashcards = useMemo(
    () => (collectionId ? allFlashcards.filter((card) => card.collectionId === collectionId) : []),
    [allFlashcards, collectionId],
  )
  const editingFlashcard = flashcards.find((card) => card.id === editingFlashcardId)
  const collectionName = useMemo(
    () => collections.find((collection) => collection.id === collectionId)?.name ?? collectionId,
    [collections, collectionId],
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

  const handleEditFlashcard = useCallback((flashcardId: string) => {
    setEditingFlashcardId(flashcardId)
  }, [])

  const handleUpdateFlashcard = useCallback(
    async (data: CreateFlashcardInput) => {
      if (!editingFlashcardId) return
      try {
        await update(editingFlashcardId, data)
        setEditingFlashcardId(null)
        setActionError(null)
        setLastFailedAction(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar la flashcard.'
        setActionError(message)
        setLastFailedAction(() => async () => {
          await update(editingFlashcardId, data)
          setEditingFlashcardId(null)
          setActionError(null)
          setLastFailedAction(null)
        })
      }
    },
    [editingFlashcardId, update],
  )

  const handleCancelEditFlashcard = useCallback(() => {
    setEditingFlashcardId(null)
  }, [])

  const handleCreateFlashcard = useCallback(
    async (data: CreateFlashcardInput) => {
      if (!collectionId) return
      try {
        await createForCollection(collectionId, data)
        setActionError(null)
        setLastFailedAction(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear la flashcard.'
        setActionError(message)
        setLastFailedAction(() => async () => {
          await createForCollection(collectionId, data)
          setActionError(null)
          setLastFailedAction(null)
        })
      }
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
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
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
          <p className="page-subtitle">Colección: {collectionName}</p>
          {network.isRefreshing ? (
            <p className="mt-1 text-sm text-indigo-600" role="status" aria-live="polite">
              Actualizando tarjetas...
            </p>
          ) : null}
        </div>
        <Link to="/collections">
          <Button variant="ghost">Volver</Button>
        </Link>
      </div>

      <div className="mt-4">
        <label htmlFor="flashcards-search" className="mb-1 block text-sm font-medium text-slate-700">
          Buscar flashcards
        </label>
        <input
          id="flashcards-search"
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
      {actionError ? (
        <div className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <p>{actionError}</p>
          {lastFailedAction ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => void lastFailedAction()}
            >
              Reintentar operación
            </Button>
          ) : null}
        </div>
      ) : null}

      <section className="section-stack">
        <div className="card-grid-2">
        {editingFlashcard ? (
  <FlashcardForm
    key={`edit-${editingFlashcard.id}`}
    mode="edit"
    initialValues={{
      question: editingFlashcard.question,
      answer: editingFlashcard.answer,
      tags: editingFlashcard.tags,
    }}
    submitLabel="Guardar cambios"
    onSubmit={(data) => void handleUpdateFlashcard(data)}
    onCancel={handleCancelEditFlashcard}
  />
) : (
  <FlashcardForm
    key={`create-${collectionId}`}
    onSubmit={(data) => void handleCreateFlashcard(data)}
  />
)}

          <Card
            title="Tarjetas de la colección"
            description="Listado de flashcards creadas en esta colección."
          >
            <FlashcardList
              flashcards={filteredFlashcards}
              onEditFlashcard={handleEditFlashcard}
              onDeleteFlashcard={(id) =>
                void remove(id).then(
                  () => {
                    setActionError(null)
                    setLastFailedAction(null)
                  },
                  (error) => {
                    const message =
                      error instanceof Error ? error.message : 'No se pudo borrar la flashcard.'
                    setActionError(message)
                    setLastFailedAction(() => async () => {
                      await remove(id)
                      setActionError(null)
                      setLastFailedAction(null)
                    })
                  },
                )
              }
            />
          </Card>
        </div>
      </section>
    </main>
  )
}
