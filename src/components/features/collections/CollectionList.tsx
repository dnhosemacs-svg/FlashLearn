import { memo } from 'react'
import EmptyStateCarbon from '../../ui-carbon/EmptyStateCarbon'
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
  // Estado vacío explícito para guiar al usuario en el siguiente paso.
  if (collections.length === 0) {
    return (
      <EmptyStateCarbon
        title="No hay colecciones"
        description="Crea tu primera colección para empezar a organizar tarjetas."
      />
    )
  }

  return (
    <section className="fl-list-stack">
      {/* Render de cada colección con callbacks delegados desde la página. */}
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
