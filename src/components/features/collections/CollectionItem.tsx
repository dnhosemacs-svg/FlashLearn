import { memo } from 'react'
import { Link } from 'react-router-dom'
import ButtonCarbon from '../../ui-carbon/ButtonCarbon'
import CardCarbon from '../../ui-carbon/CardCarbon'
import type { Collection } from '../../../types/domain'

interface CollectionItemProps {
  collection: Collection
  onEdit: (collectionId: string) => void
  onDelete: (collectionId: string) => void
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function CollectionItem({ collection, onEdit, onDelete }: CollectionItemProps) {
  const collectionRef = `${toSlug(collection.name) || 'coleccion'}-${collection.id}`

  return (
    <CardCarbon
      title={collection.name}
      description={collection.description || 'Sin descripcion'}
      actions={
        <div className="flex flex-wrap justify-end gap-2">
          <Link to={`/collections/${collectionRef}`} className="w-full sm:w-auto">
            <ButtonCarbon variant="secondary" size="sm" className="w-full sm:w-auto">
              Abrir
            </ButtonCarbon>
          </Link>

          <ButtonCarbon
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onEdit(collection.id)}
          >
            Editar
          </ButtonCarbon>
          <ButtonCarbon
            variant="danger"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onDelete(collection.id)}
          >
            Borrar
          </ButtonCarbon>
        </div>
      }
      className="h-full"
    >
      <p className="text-xs text-slate-500">Actualizada: {collection.updatedAt}</p>
    </CardCarbon>
  )
}

export default memo(CollectionItem)
