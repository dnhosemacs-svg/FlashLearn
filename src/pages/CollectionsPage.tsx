import { useCallback, useEffect, useMemo, useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import CollectionListSkeleton from '../components/features/collections/CollectionListSkeleton'
import Alert from '../components/ui/Alert'
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'
import EmptyStateCarbon from '../components/ui-carbon/EmptyStateCarbon'
import ModalCarbon from '../components/ui-carbon/ModalCarbon'
import SearchCarbon from '../components/ui-carbon/SearchCarbon'
import { useCollectionsContext } from '../context/useCollectionsContext'
import { useFlashcardsContext } from '../context/useFlashcardsContext'
import { loadCollectionsSearch, saveCollectionsSearch } from '../lib/storage/uiStateStorage'
import type { UpdateCollectionInput } from '../types/domain'

const PAGE_TITLE = 'Colecciones'
const PAGE_SUBTITLE = 'Crea y administra tus colecciones de estudio'

export default function CollectionsPage() {
  const { collections, network, refresh, create, update, remove } = useCollectionsContext()
  const { removeByCollection } = useFlashcardsContext()
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteCollectionId, setPendingDeleteCollectionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(() => loadCollectionsSearch())
  const [actionError, setActionError] = useState<string | null>(null)
  const [lastFailedAction, setLastFailedAction] = useState<(() => Promise<void>) | null>(null)
  const existingCollectionNames = useMemo(() => collections.map((collection) => collection.name), [collections])

  // Centraliza el manejo de errores/reintentos para acciones async de la vista.
  const runWithRetry = useCallback(
    async (action: () => Promise<void>, fallbackMessage: string) => {
      try {
        await action()
        setActionError(null)
        setLastFailedAction(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : fallbackMessage
        setActionError(message)
        setLastFailedAction(() => action)
      }
    },
    [],
  )

  const collectionsStats = useMemo(() => {
    // Métricas rápidas para resumen de calidad de datos.
    const total = collections.length
    const withDescription = collections.filter((c) => !!c.description?.trim()).length
    const withoutDescription = total - withDescription

    return { total, withDescription, withoutDescription }
  }, [collections])

  const handleDeleteCollection = useCallback((collectionId: string) => {
    setPendingDeleteCollectionId(collectionId)
    setIsDeleteModalOpen(true)
  }, [])

  const handleEditCollection = useCallback((collectionId: string) => {
    setEditingCollectionId(collectionId)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingCollectionId(null)
  }, [])

  const handleUpdateCollection = useCallback(
    async (data: UpdateCollectionInput) => {
      if (!editingCollectionId) return
      const targetCollectionId = editingCollectionId
      await runWithRetry(
        async () => {
          await update(targetCollectionId, data)
          setEditingCollectionId(null)
        },
        'No se pudo actualizar la colección.',
      )
    },
    [editingCollectionId, runWithRetry, update],
  )

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setPendingDeleteCollectionId(null)
  }, [])

  const handleConfirmDeleteCollection = useCallback(async () => {
    if (!pendingDeleteCollectionId) return
    const targetCollectionId = pendingDeleteCollectionId

    if (editingCollectionId === pendingDeleteCollectionId) {
      setEditingCollectionId(null)
    }

    await runWithRetry(
      async () => {
        // Borrado en cascada: elimina flashcards de la colección antes de borrar la colección.
        await removeByCollection(targetCollectionId)
        await remove(targetCollectionId)
        setIsDeleteModalOpen(false)
        setPendingDeleteCollectionId(null)
      },
      'No se pudo borrar la colección.',
    )
  }, [pendingDeleteCollectionId, editingCollectionId, remove, removeByCollection, runWithRetry])

  const editingCollection = collections.find(
    (collection) => collection.id === editingCollectionId,
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredCollections = useMemo(() => {
    // Filtro case-insensitive por nombre y descripción.
    if (!normalizedQuery) return collections

    return collections.filter((collection) => {
      const name = collection.name.toLowerCase()
      const description = (collection.description ?? '').toLowerCase()
      return name.includes(normalizedQuery) || description.includes(normalizedQuery)
    })
  }, [collections, normalizedQuery])

  useEffect(() => {
    saveCollectionsSearch(searchQuery)
  }, [searchQuery])

  if (network.status === 'loading' && collections.length === 0) {
    return (
      <main className="page-shell">
        <h1 className="page-title">{PAGE_TITLE}</h1>
        <p className="page-subtitle">{PAGE_SUBTITLE}</p>
        <section className="section-stack mt-6">
          <CollectionListSkeleton count={4} />
        </section>
      </main>
    )
  }

  if (network.status === 'error') {
    return (
      <main className="page-shell">
        <h1 className="page-title">{PAGE_TITLE}</h1>
        <p className="page-subtitle">{PAGE_SUBTITLE}</p>
        <section className="section-stack">
          <EmptyStateCarbon
            title="No se pudieron cargar las colecciones"
            description={network.error ?? 'Error desconocido'}
            action={
              <ButtonCarbon type="button" onClick={() => void refresh()}>
                Reintentar
              </ButtonCarbon>
            }
          />
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">{PAGE_TITLE}</h1>
      <p className="page-subtitle">{PAGE_SUBTITLE}</p>
      {network.isRefreshing ? (
        <p className="text-muted mt-2" role="status" aria-live="polite">
          Actualizando colecciones...
        </p>
      ) : null}

      <div className="mt-4">
        <SearchCarbon
          id="collections-search"
          label="Buscar colecciones"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar colecciones por nombre o descripción..."
        />
      </div>

      <p className="mt-2 text-muted">
        Total: {collectionsStats.total} | Con descripción: {collectionsStats.withDescription} | Sin descripción: {collectionsStats.withoutDescription}.
      </p>
      {actionError ? (
        <Alert
          variant="danger"
          className="mt-3"
          action={
            lastFailedAction ? (
              <ButtonCarbon type="button" variant="secondary" size="sm" onClick={() => void lastFailedAction()}>
                Reintentar operación
              </ButtonCarbon>
            ) : null
          }
        >
          {actionError}
        </Alert>
      ) : null}

      <section className="section-stack">
        <div className="card-grid-2">
          {editingCollection ? (
            <CollectionForm
              key={`edit-${editingCollection.id}`}
              mode="edit"
              initialValues={{
                name: editingCollection.name,
                description: editingCollection.description,
              }}
              submitLabel="Guardar cambios"
              onSubmit={(data) => void handleUpdateCollection(data)}
              onCancel={handleCancelEdit}
              existingNames={existingCollectionNames}
              currentName={editingCollection.name}
            />
          ) : (
            <CollectionForm
              key="create-collection"
              onSubmit={(data) =>
                void runWithRetry(
                  async () => {
                    await create(data)
                  },
                  'No se pudo crear la colección.',
                )
              }
              existingNames={existingCollectionNames}
            />
          )}
          <CollectionList
            collections={filteredCollections}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        </div>
      </section>

      <ModalCarbon
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Borrar colección"
        description="Esta acción no se puede deshacer."
        size="sm"
        footer={
          <>
            <ButtonCarbon type="button" variant="ghost" onClick={handleCloseDeleteModal}>
              Cancelar
            </ButtonCarbon>
            <ButtonCarbon type="button" variant="danger" onClick={handleConfirmDeleteCollection}>
              Borrar
            </ButtonCarbon>
          </>
        }
      >
        <p>¿Seguro que quieres borrar esta colección?</p>
      </ModalCarbon>
    </main>
  )
}
