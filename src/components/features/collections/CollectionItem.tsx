import Button from '../../ui/Button'
import Card from '../../ui/Card'
import type { Collection } from '../../../types/domain'

interface CollectionItemProps {
  collection: Collection
  onEdit: (collectionId: string) => void
  onDelete: (collectionId: string) => void
}

export default function CollectionItem({
  collection,
  onEdit,
  onDelete,
}: CollectionItemProps) {
  return (
    <Card
      title={collection.name}
      description={collection.description || 'Sin descripcion'}
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(collection.id)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(collection.id)}>
            Borrar
          </Button>
        </div>
      }
      className="h-full"
    >
      <p className="text-xs text-slate-500">Actualizada: {collection.updatedAt}</p>
    </Card>
  )
}
