import { useCallback, useEffect, useMemo, useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const COLLECTIONS_STORAGE_KEY = 'flashlearn.collections'

function loadStoredCollections(): Collection[] {
  const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteCollectionId, setPendingDeleteCollectionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setCollections(loadStoredCollections())
  }, [])

  useEffect(() => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
  }, [collections])

  const collectionsStats = useMemo(() => {
    const total = collections.length
    const withDescription = collections.filter((c) => !!c.description?.trim()).length
    const withoutDescription = total - withDescription

    return { total, withDescription, withoutDescription }
  }, [collections])

  const handleCreateCollection = useCallback((data: CreateCollectionInput) => {
    const now = new Date().toISOString()
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    }

    setCollections((prev) => [newCollection, ...prev])
  }, [])

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
      const now = new Date().toISOString()
      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === editingCollectionId
            ? {
                ...collection,
                name: data.name,
                description: data.description,
                updatedAt: now,
              }
            : collection,
        ),
      )
      setEditingCollectionId(null)
    },
    [editingCollectionId],
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

    setCollections((prev) =>
      prev.filter((collection) => collection.id !== pendingDeleteCollectionId),
    )

    setIsDeleteModalOpen(false)
    setPendingDeleteCollectionId(null)
  }, [pendingDeleteCollectionId, editingCollectionId])

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
            />
          ) : (
            <CollectionForm onSubmit={handleCreateCollection} />
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
