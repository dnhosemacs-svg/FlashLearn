import { memo } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import type { Collection } from '../../../types/domain'

interface CollectionItemProps {
  collection: Collection
  onEdit: (collectionId: string) => void
  onDelete: (collectionId: string) => void
}

function CollectionItem({ collection, onEdit, onDelete }: CollectionItemProps) {
  return (
    <Card
      title={collection.name}
      description={collection.description || 'Sin descripcion'}
      actions={
        <div className="flex flex-wrap justify-end gap-2">
          <Link to={`/collections/${collection.id}`} className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              Abrir
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onEdit(collection.id)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onDelete(collection.id)}
          >
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

export default memo(CollectionItem)
