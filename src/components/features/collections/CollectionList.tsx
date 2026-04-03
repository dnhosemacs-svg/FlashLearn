import { memo } from 'react'
import EmptyState from '../../ui/EmptyState'
import type { Collection } from '../../../types/domain'
import CollectionItem from './CollectionItem'

interface CollectionListProps {
  collections: Collection[]
  onEditCollection: (collectionId: string) => void
  onDeleteCollection: (collectionId: string) => void
}

function CollectionList({
  collections,
  onEditCollection,
  onDeleteCollection,
}: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <EmptyState
        title="No hay colecciones"
        description="Crea tu primera coleccion para empezar a organizar tarjetas."
      />
    )
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {collections.map((collection) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          onEdit={onEditCollection}
          onDelete={onDeleteCollection}
        />
      ))}
    </section>
  )
}

export default memo(CollectionList)
