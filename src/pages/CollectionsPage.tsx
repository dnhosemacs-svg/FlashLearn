import { useEffect, useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

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
  const [collections, setCollections] = useState<Collection[]>(loadStoredCollections)
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
  }, [collections])

  const handleCreateCollection = (data: CreateCollectionInput) => {
    const now = new Date().toISOString()
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    }

    setCollections((prev) => [newCollection, ...prev])
  }

  const handleDeleteCollection = (collectionId: string) => {
    if (editingCollectionId === collectionId) {
      setEditingCollectionId(null)
    }
    setCollections((prev) => prev.filter((collection) => collection.id !== collectionId))
  }

  const handleEditCollection = (collectionId: string) => {
    setEditingCollectionId(collectionId)
  }

  const handleCancelEdit = () => {
    setEditingCollectionId(null)
  }

  const handleUpdateCollection = (data: UpdateCollectionInput) => {
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
  }

  const editingCollection = collections.find(
    (collection) => collection.id === editingCollectionId,
  )

  return (
    <main className="page-shell">
      <h1 className="page-title">Colecciones</h1>
      <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>

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
            collections={collections}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        </div>
      </section>
    </main>
  )
}
