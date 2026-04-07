import { createContext, useContext, type ReactNode } from 'react'
import { useCollections } from '../hooks'
import type { UseCollectionsResult } from '../hooks/useCollections'

type CollectionsContextValue = UseCollectionsResult

const CollectionsContext = createContext<CollectionsContextValue | null>(null)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const value = useCollections()

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollectionsContext(): CollectionsContextValue {
  const ctx = useContext(CollectionsContext)

  if (ctx == null) {
    throw new Error('useCollectionsContext debe usarse dentro de CollectionsProvider')
  }

  return ctx
}