import { useContext } from 'react'
import { CollectionsContext } from './collectionsContextObject'
import type { UseCollectionsResult } from '../hooks/useCollections'

export function useCollectionsContext(): UseCollectionsResult {
  const ctx = useContext(CollectionsContext)
  if (ctx == null) {
    // Falla temprano para detectar uso fuera del provider en desarrollo.
    throw new Error('useCollectionsContext debe usarse dentro de CollectionsProvider')
  }
  return ctx
}
