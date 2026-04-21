import type { ReactNode } from 'react'
import { useCollections } from '../hooks'
import { CollectionsContext } from './collectionsContextObject'

export function CollectionsProvider({ children }: { children: ReactNode }) {
  // Inyecta el estado/acciones de colecciones a todo el árbol de componentes.
  const value = useCollections()

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  )
}