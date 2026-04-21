import type { ReactNode } from 'react'
import { useFlashcards } from '../hooks'
import { FlashcardsContext } from './flashcardsContextObject'

/**
 * Una sola fuente en memoria para todas las flashcards.
 * Las páginas filtran por `collectionId` o usan `flashcards` (todas) en estudio.
 */
export function FlashcardsProvider({ children }: { children: ReactNode }) {
  // Proveedor único para compartir flashcards entre páginas de detalle y estudio.
  const value = useFlashcards()

  return <FlashcardsContext.Provider value={value}>{children}</FlashcardsContext.Provider>
}
