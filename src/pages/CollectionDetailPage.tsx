import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'
import CardCarbon from '../components/ui-carbon/CardCarbon'
import EmptyStateCarbon from '../components/ui-carbon/EmptyStateCarbon'
import FlashcardForm from '../components/features/flashcards/FlashcardForm'
import FlashcardList from '../components/features/flashcards/FlashcardList'
import ModalCarbon from '../components/ui-carbon/ModalCarbon'
import SearchCarbon from '../components/ui-carbon/SearchCarbon'
import SkeletonCarbon from '../components/ui-carbon/SkeletonCarbon'
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteFlashcardId, setPendingDeleteFlashcardId] = useState<string | null>(null)
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

  const handleDeleteFlashcard = useCallback((flashcardId: string) => {
    setPendingDeleteFlashcardId(flashcardId)
    setIsDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setPendingDeleteFlashcardId(null)
  }, [])

  const handleConfirmDeleteFlashcard = useCallback(async () => {
    if (!pendingDeleteFlashcardId) return

    try {
      await remove(pendingDeleteFlashcardId)
      setActionError(null)
      setLastFailedAction(null)
      setIsDeleteModalOpen(false)
      setPendingDeleteFlashcardId(null)
    } catch (error) {
      const failedId = pendingDeleteFlashcardId
      const message = error instanceof Error ? error.message : 'No se pudo borrar la flashcard.'
      setActionError(message)
      setLastFailedAction(() => async () => {
        await remove(failedId)
        setActionError(null)
        setLastFailedAction(null)
      })
      setIsDeleteModalOpen(false)
      setPendingDeleteFlashcardId(null)
    }
  }, [pendingDeleteFlashcardId, remove])

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
        <EmptyStateCarbon
          title="Coleccion no valida"
          description="No se encontro un identificador de coleccion en la URL."
        />
        <div className="mt-4">
            <ButtonCarbon variant="ghost" onClick={() => navigate('/collections')}>Volver a colecciones</ButtonCarbon>
        </div>
      </main>
    )
  }

  if (network.status === 'loading' && flashcards.length === 0) {
    return (
      <main className="page-shell">
        <div className="page-header">
          <h1 className="page-title">Detalle de coleccion</h1>
          <Link to="/collections">
            <ButtonCarbon variant="ghost">Volver</ButtonCarbon>
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          <SkeletonCarbon className="h-10 w-full" />
          <SkeletonCarbon className="h-24 w-full" />
          <SkeletonCarbon className="h-24 w-full" />
          <SkeletonCarbon className="h-24 w-full" />
        </div>
      </main>
    )
  }

  if (network.status === 'error') {
    return (
      <main className="page-shell">
        <div className="page-header">
          <h1 className="page-title">Detalle de coleccion</h1>
          <Link to="/collections">
            <ButtonCarbon variant="ghost">Volver</ButtonCarbon>
          </Link>
        </div>
        <EmptyStateCarbon
          title="No se pudieron cargar las tarjetas"
          description={network.error ?? 'Error desconocido'}
          action={
            <ButtonCarbon type="button" onClick={() => void refresh()}>
              Reintentar
            </ButtonCarbon>
          }
        />
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Detalle de coleccion</h1>
          <p className="page-subtitle">Coleccion: {collectionName}</p>
          {network.isRefreshing ? (
            <p className="mt-1 text-sm text-slate-600" role="status" aria-live="polite">
              Actualizando tarjetas...
            </p>
          ) : null}
        </div>
        <Link to="/collections">
          <ButtonCarbon variant="ghost">Volver</ButtonCarbon>
        </Link>
      </div>

      <div className="mt-4">
        <SearchCarbon
          id="flashcards-search"
          label="Buscar flashcards"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por pregunta, respuesta o tags..."
        />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Total: {flashcardsStats.total} | Con tags: {flashcardsStats.withTags} | Sin tags: {flashcardsStats.withoutTags}.
      </p>
      {actionError ? (
        <Alert
          variant="danger"
          className="mt-3"
          action={
            lastFailedAction ? (
              <ButtonCarbon type="button" variant="secondary" size="sm" onClick={() => void lastFailedAction()}>
                Reintentar operacion
              </ButtonCarbon>
            ) : null
          }
        >
          {actionError}
        </Alert>
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

          <CardCarbon
            title="Tarjetas de la coleccion"
            description="Listado de flashcards creadas en esta coleccion."
          >
            <FlashcardList
              flashcards={filteredFlashcards}
              onEditFlashcard={handleEditFlashcard}
              onDeleteFlashcard={handleDeleteFlashcard}
            />
          </CardCarbon>
        </div>
      </section>

      <ModalCarbon
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Borrar flashcard"
        description="Esta accion no se puede deshacer."
        footer={
          <>
            <ButtonCarbon type="button" variant="ghost" onClick={handleCloseDeleteModal}>
              Cancelar
            </ButtonCarbon>
            <ButtonCarbon type="button" variant="danger" onClick={handleConfirmDeleteFlashcard}>
              Borrar
            </ButtonCarbon>
          </>
        }
      >
        <p>Seguro que quieres borrar esta flashcard?</p>
      </ModalCarbon>
    </main>
  )
}
