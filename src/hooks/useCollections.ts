import { useCallback, useEffect, useState } from 'react'
import { loadStoredCollections, saveCollections } from '../lib/storage/collectionsStorage'
import type { AsyncState } from '../types/async'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

export interface UseCollectionsResult {
  collections: Collection[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateCollectionInput) => void
  update: (id: string, input: UpdateCollectionInput) => void
  remove: (id: string) => void
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
      if (hasData) {
        return { ...prev, isRefreshing: true, error: null }
      }
      return { status: 'loading', error: null, isRefreshing: false }
    })
  
    try {
      const data = loadStoredCollections()
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

  useEffect(() => {
    if (network.status !== 'success') return
    saveCollections(collections)
  }, [collections, network.status])

  const create = useCallback((input: CreateCollectionInput) => {
    const now = new Date().toISOString()
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    }
    setCollections((prev) => [newCollection, ...prev])
  }, [])

  const update = useCallback((id: string, input: UpdateCollectionInput) => {
    const now = new Date().toISOString()
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              name: input.name,
              description: input.description,
              updatedAt: now,
            }
          : collection,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id))
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
