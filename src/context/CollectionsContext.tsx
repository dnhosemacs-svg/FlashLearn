import type { ReactNode } from 'react'
import { useCollections } from '../hooks'
import { CollectionsContext } from './collectionsContextObject'

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const value = useCollections()

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  )
}