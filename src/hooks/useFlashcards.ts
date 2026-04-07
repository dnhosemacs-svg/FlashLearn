import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadStoredFlashcards, saveFlashcards } from '../lib/storage/flashcardsStorage'
import type { AsyncState } from '../types/async'
import type { CreateFlashcardInput, Flashcard, UpdateFlashcardInput } from '../types/domain'

export interface UseFlashcardsResult {
  /** Tarjetas de la colección si hay `collectionId`; si no, todas las flashcards. */
  flashcards: Flashcard[]
  /** Store completo (todas las colecciones). */
  allFlashcards: Flashcard[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateFlashcardInput) => void
  /** Crea una tarjeta en la colección indicada (útil con el provider global sin `collectionId` fijo). */
  createForCollection: (collectionId: string, input: CreateFlashcardInput) => void
  remove: (id: string) => void
  update: (id: string, input: UpdateFlashcardInput) => void
}

/**
 * Carga y persiste flashcards en `localStorage`.
 * Con `collectionId`, `flashcards` queda filtrado y `create` asocia la tarjeta a esa colección.
 */
export function useFlashcards(collectionId?: string): UseFlashcardsResult {
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([])
  const [network, setNetwork] = useState<AsyncState>({ status: 'idle', error: null })

  const refresh = useCallback(async () => {
    setNetwork({ status: 'loading', error: null })
    try {
      const data = loadStoredFlashcards()
      setAllFlashcards(data)
      setNetwork({ status: 'success', error: null })
    } catch (error) {
      setNetwork({
        status: 'error',
        error: error instanceof Error ? error.message : 'Error al cargar flashcards',
      })
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (network.status !== 'success') return
    saveFlashcards(allFlashcards)
  }, [allFlashcards, network.status])

  const flashcards = useMemo(() => {
    if (!collectionId) return allFlashcards
    return allFlashcards.filter((card) => card.collectionId === collectionId)
  }, [allFlashcards, collectionId])

  const createForCollection = useCallback((targetCollectionId: string, input: CreateFlashcardInput) => {
    const now = new Date().toISOString()
    const newFlashcard: Flashcard = {
      id: crypto.randomUUID(),
      collectionId: targetCollectionId,
      question: input.question,
      answer: input.answer,
      tags: input.tags,
      createdAt: now,
      updatedAt: now,
    }

    setAllFlashcards((prev) => [newFlashcard, ...prev])
  }, [])

  const create = useCallback(
    (input: CreateFlashcardInput) => {
      if (!collectionId) return
      createForCollection(collectionId, input)
    },
    [collectionId, createForCollection],
  )

  const update = useCallback((id: string, input: UpdateFlashcardInput) => {
    const now = new Date().toISOString()
    setAllFlashcards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              question: input.question,
              answer: input.answer,
              tags: input.tags,
              updatedAt: now,
            }
          : card,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setAllFlashcards((prev) => prev.filter((card) => card.id !== id))
  }, [])

  return {
    flashcards,
    allFlashcards,
    network,
    refresh,
    create,
    createForCollection,
    update,
    remove,
  }
}
