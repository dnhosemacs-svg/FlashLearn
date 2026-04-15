import { useCallback, useEffect, useState } from 'react'
import {
  deleteCollection,
  getCollections,
  patchCollection,
  postCollection,
} from '../api/collectionsApi'
import type { AsyncState } from '../types/async'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

export interface UseCollectionsResult {
  collections: Collection[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateCollectionInput) => Promise<void>
  update: (id: string, input: UpdateCollectionInput) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function useCollections(): UseCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([])
  const [network, setNetwork] = useState<AsyncState>({
    status: 'idle',
    error: null,
    isRefreshing: false,
  })

  const refresh = useCallback(async () => {
    setNetwork((prev) => {
      const hasData = collections.length > 0
      if (hasData) return { ...prev, isRefreshing: true, error: null }
      return { status: 'loading', error: null, isRefreshing: false }
    })
  
    try {
      const data = await getCollections()
      setCollections(data)
      setNetwork({ status: 'success', error: null, isRefreshing: false })
    } catch (error) {
      setNetwork({
        status: 'error',
        error: error instanceof Error ? error.message : 'Error al cargar colecciones',
        isRefreshing: false,
      })
    }
  }, [collections.length])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const create = useCallback(async (input: CreateCollectionInput) => {
    const created = await postCollection(input)
    setCollections((prev) => [created, ...prev])
  }, [])
  
  const update = useCallback(async (id: string, input: UpdateCollectionInput) => {
    const updated = await patchCollection(id, input)
    setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }, [])
  
  const remove = useCallback(async (id: string) => {
    await deleteCollection(id)
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return {
    collections,
    network,
    refresh,
    create,
    update,
    remove,
  }
}