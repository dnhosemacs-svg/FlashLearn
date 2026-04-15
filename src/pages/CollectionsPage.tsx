import { useCallback, useEffect, useMemo, useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import CollectionListSkeleton from '../components/features/collections/CollectionListSkeleton'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { useCollectionsContext } from '../context/useCollectionsContext'
import { useFlashcardsContext } from '../context/useFlashcardsContext'
import { loadCollectionsSearch, saveCollectionsSearch } from '../lib/storage/uiStateStorage'
import type { UpdateCollectionInput } from '../types/domain'

export default function CollectionsPage() {
  const { collections, network, refresh, create, update, remove } = useCollectionsContext()
  const { removeByCollection } = useFlashcardsContext()
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteCollectionId, setPendingDeleteCollectionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(() => loadCollectionsSearch())

  const collectionsStats = useMemo(() => {
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
      await update(editingCollectionId, data)
      setEditingCollectionId(null)
    },
    [editingCollectionId, update],
  )

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setPendingDeleteCollectionId(null)
  }, [])

  const handleConfirmDeleteCollection = useCallback(async () => {
    if (!pendingDeleteCollectionId) return

    if (editingCollectionId === pendingDeleteCollectionId) {
      setEditingCollectionId(null)
    }

    // Borrado en cascada: elimina flashcards de la colección antes de borrar la colección.
    await removeByCollection(pendingDeleteCollectionId)
    await remove(pendingDeleteCollectionId)

    setIsDeleteModalOpen(false)
    setPendingDeleteCollectionId(null)
  }, [pendingDeleteCollectionId, editingCollectionId, remove, removeByCollection])

  const editingCollection = collections.find(
    (collection) => collection.id === editingCollectionId,
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredCollections = useMemo(() => {
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
        <h1 className="page-title">Colecciones</h1>
        <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>
        <section className="section-stack mt-6">
          <CollectionListSkeleton count={4} />
        </section>
      </main>
    )
  }

  if (network.status === 'error') {
    return (
      <main className="page-shell">
        <h1 className="page-title">Colecciones</h1>
        <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>
        <section className="section-stack">
          <EmptyState
            title="No se pudieron cargar las colecciones"
            description={network.error ?? 'Error desconocido'}
            action={
              <Button type="button" onClick={() => void refresh()}>
                Reintentar
              </Button>
            }
          />
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Colecciones</h1>
      <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>
      {network.isRefreshing ? (
        <p className="mt-2 text-sm text-indigo-600">Actualizando colecciones...</p>
      ) : null}

      <div className="mt-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar colecciones por nombre o descripcion..."
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Total: {collectionsStats.total} | Con descripción: {collectionsStats.withDescription} | Sin descripción: {collectionsStats.withoutDescription}.
      </p>

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
              existingNames={collections.map((c) => c.name)}
              currentName={editingCollection.name}
            />
          ) : (
            <CollectionForm
              key="create-collection"
              onSubmit={(data) => void create(data)}
              existingNames={collections.map((c) => c.name)}
            />
          )}
          <CollectionList
            collections={filteredCollections}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        </div>
      </section>

      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Borrar colección"
        description="Esta acción no se puede deshacer."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={handleCloseDeleteModal}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" onClick={handleConfirmDeleteCollection}>
              Borrar
            </Button>
          </>
        }
      >
        <p>¿Seguro que quieres borrar esta colección?</p>
      </Modal>
    </main>
  )
}
