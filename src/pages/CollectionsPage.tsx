import { useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)

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
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Colecciones</h1>
      <p className="mt-2 text-slate-300">Crea y administra tus colecciones de estudio</p>

      <section className="mt-8 space-y-6">
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
      </section>
    </main>
  )
}
