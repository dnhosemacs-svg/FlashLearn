import { createContext, useContext, type ReactNode } from 'react'
import { useFlashcards } from '../hooks'
import type { UseFlashcardsResult } from '../hooks/useFlashcards'

const FlashcardsContext = createContext<UseFlashcardsResult | null>(null)

/**
 * Una sola fuente en memoria para todas las flashcards.
 * Las páginas filtran por `collectionId` o usan `flashcards` (todas) en estudio.
 */
export function FlashcardsProvider({ children }: { children: ReactNode }) {
  const value = useFlashcards()

  return <FlashcardsContext.Provider value={value}>{children}</FlashcardsContext.Provider>
}

export function useFlashcardsContext(): UseFlashcardsResult {
  const ctx = useContext(FlashcardsContext)

  if (ctx == null) {
    throw new Error('useFlashcardsContext debe usarse dentro de FlashcardsProvider')
  }

  return ctx
}
