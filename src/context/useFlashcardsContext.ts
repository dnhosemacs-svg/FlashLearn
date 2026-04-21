import { useContext } from 'react'
import { FlashcardsContext } from './flashcardsContextObject'
import type { UseFlashcardsResult } from '../hooks/useFlashcards'

export function useFlashcardsContext(): UseFlashcardsResult {
  const ctx = useContext(FlashcardsContext)
  if (ctx == null) {
    // Garantiza contrato de uso correcto del hook.
    throw new Error('useFlashcardsContext debe usarse dentro de FlashcardsProvider')
  }
  return ctx
}
