import { createContext } from 'react'
import type { UseCollectionsResult } from '../hooks/useCollections'

export const CollectionsContext = createContext<UseCollectionsResult | null>(null)
// Context base inicializado en null para obligar verificación en hooks consumidores.
