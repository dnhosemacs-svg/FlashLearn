import { useCallback, useMemo, useRef, useState } from 'react'
import {
  deleteFlashcard,
  getFlashcards,
  patchFlashcard,
  postFlashcard,
} from '../api/flashcardsApi'
import type { AsyncState } from '../types/async'
import type { CreateFlashcardInput, Flashcard, UpdateFlashcardInput } from '../types/domain'

export interface UseFlashcardsResult {
  /** Tarjetas de la colección si hay `collectionId`; si no, todas las flashcards. */
  flashcards: Flashcard[]
  /** Store completo (todas las colecciones). */
  allFlashcards: Flashcard[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateFlashcardInput) => Promise<void>
  createForCollection: (collectionId: string, input: CreateFlashcardInput) => Promise<void>
  remove: (id: string) => Promise<void>
  removeByCollection: (collectionId: string) => Promise<void>
  update: (id: string, input: UpdateFlashcardInput) => Promise<void>
}

/**
 * Fuente de verdad en API para flashcards.
 * Con `collectionId`, `flashcards` queda filtrado y `create` asocia la tarjeta a esa colección.
 */
export function useFlashcards(collectionId?: string): UseFlashcardsResult {
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([])
  const [network, setNetwork] = useState<AsyncState>({
    status: 'idle',
    error: null,
    isRefreshing: false,
  })

  const refresh = useCallback(async () => {
    // Estrategia de carga equivalente a colecciones: full load inicial, refresh luego.
    setNetwork((prev) => {
      const hasData = allFlashcards.length > 0
      if (hasData) return { ...prev, isRefreshing: true, error: null }
      return { status: 'loading', error: null, isRefreshing: false }
    })
  
    try {
      const data = await getFlashcards()
      setAllFlashcards(data)
      setNetwork({ status: 'success', error: null, isRefreshing: false })
    } catch (error) {
      setNetwork({
        status: 'error',
        error: error instanceof Error ? error.message : 'Error al cargar flashcards',
        isRefreshing: false,
      })
    }
  }, [allFlashcards.length])

  const didInitRef = useRef<true | null>(null)
  if (didInitRef.current == null) {
    didInitRef.current = true
    queueMicrotask(() => {
      void refresh()
    })
  }

  const flashcards = useMemo(() => {
    // Vista derivada para soportar tanto contexto global como por colección.
    if (!collectionId) return allFlashcards
    return allFlashcards.filter((card) => card.collectionId === collectionId)
  }, [allFlashcards, collectionId])

  const createForCollection = useCallback(async (targetCollectionId: string, input: CreateFlashcardInput) => {
    const created = await postFlashcard({ collectionId: targetCollectionId, ...input })
    setAllFlashcards((prev) => [created, ...prev])
  }, [])
  
  const create = useCallback(async (input: CreateFlashcardInput) => {
    if (!collectionId) return
    await createForCollection(collectionId, input)
  }, [collectionId, createForCollection])
  
  const update = useCallback(async (id: string, input: UpdateFlashcardInput) => {
    const updated = await patchFlashcard(id, input)
    setAllFlashcards((prev) => prev.map((card) => (card.id === id ? updated : card)))
  }, [])
  
  const remove = useCallback(async (id: string) => {
    await deleteFlashcard(id)
    setAllFlashcards((prev) => prev.filter((card) => card.id !== id))
  }, [])

  const removeByCollection = useCallback(async (targetCollectionId: string) => {
    // Borrado en lote para mantener consistencia cuando se elimina una colección.
    const cardsToDelete = allFlashcards.filter((c) => c.collectionId === targetCollectionId)
    await Promise.all(cardsToDelete.map((card) => deleteFlashcard(card.id)))
    setAllFlashcards((prev) => prev.filter((c) => c.collectionId !== targetCollectionId))
  }, [allFlashcards])

  return {
    flashcards,
    allFlashcards,
    network,
    refresh,
    create,
    createForCollection,
    update,
    remove,
    removeByCollection,
  }
}
