import { createContext } from 'react'
import type { UseFlashcardsResult } from '../hooks/useFlashcards'

export const FlashcardsContext = createContext<UseFlashcardsResult | null>(null)
