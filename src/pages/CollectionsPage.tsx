import { useState } from 'react'
import CollectionForm from '../components/features/collections/CollectionForm'
import CollectionList from '../components/features/collections/CollectionList'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

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

  const handleRunSimulation = () => {
    setIsSimulating(true)
    window.setTimeout(() => {
      setIsSimulating(false)
    }, 1200)
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Colecciones</h1>
      <p className="page-subtitle">Crea y administra tus colecciones de estudio</p>

      <section className="section-stack">
        <Card
          title="Demo UI: Modal + Badge + Spinner"
          description="Bloque de prueba visual para componentes base reutilizables."
          variant="bordered"
          footer={
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setIsDemoModalOpen(true)}>
                Abrir modal
              </Button>
              <Button variant="ghost" onClick={handleRunSimulation} isLoading={isSimulating}>
                Simular carga
              </Button>
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge label="default" />
            <Badge label="info" variant="info" />
            <Badge label="success" variant="success" />
            <Badge label="warning" variant="warning" />
            <Badge label="danger" variant="danger" />
          </div>
          {isSimulating && (
            <div className="mt-4">
              <Spinner size="sm" label="Procesando demo" />
            </div>
          )}
        </Card>

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

      <Modal
        open={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Demo del componente Modal"
        description="Este modal valida apertura, cierre y estructura reutilizable."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDemoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsDemoModalOpen(false)}>Confirmar</Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Puedes cerrarlo con el backdrop, con la tecla Escape o con los botones del footer.
        </p>
      </Modal>
    </main>
  )
}
