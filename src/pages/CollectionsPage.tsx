import { useCallback, useMemo, useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import { useCollectionsContext } from '../context/CollectionsContext'
import { useFlashcardsContext } from '../context/FlashcardsContext'
import type { UpdateCollectionInput } from '../types/domain'

export default function CollectionsPage() {
  const { collections, network, refresh, create, update, remove } = useCollectionsContext()
  const { removeByCollection } = useFlashcardsContext()
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteCollectionId, setPendingDeleteCollectionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
    (data: UpdateCollectionInput) => {
      if (!editingCollectionId) return
      update(editingCollectionId, data)
      setEditingCollectionId(null)
    },
    [editingCollectionId, update],
  )

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setPendingDeleteCollectionId(null)
  }, [])

  const handleConfirmDeleteCollection = useCallback(() => {
    if (!pendingDeleteCollectionId) return

    if (editingCollectionId === pendingDeleteCollectionId) {
      setEditingCollectionId(null)
    }

    // Borrado en cascada: elimina flashcards de la colección antes de borrar la colección.
    removeByCollection(pendingDeleteCollectionId)
    remove(pendingDeleteCollectionId)

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

  if (network.status === 'loading' && collections.length === 0) {
    return (
      <main className="page-shell">
        <h1 className="page-title">Colecciones</h1>
        <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>
        <div className="mt-8 flex justify-center">
          <Spinner label="Cargando colecciones" />
        </div>
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
              mode="edit"
              initialValues={{
                name: editingCollection.name,
                description: editingCollection.description,
              }}
              submitLabel="Guardar cambios"
              onSubmit={handleUpdateCollection}
              onCancel={handleCancelEdit}
              existingNames={collections.map((c) => c.name)}
              currentName={editingCollection.name}
            />
          ) : (
            <CollectionForm
              onSubmit={create}
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
