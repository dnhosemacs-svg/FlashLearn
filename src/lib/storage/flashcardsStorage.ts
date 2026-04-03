import type { Flashcard } from '../../types/domain'

export const FLASHCARDS_STORAGE_KEY = 'flashlearn.flashcards'

export function loadStoredFlashcards(): Flashcard[] {
  const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? (parsed as Flashcard[]) : []
  } catch {
    return []
  }
}

export function saveFlashcards(flashcards: Flashcard[]): void {
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards))
}
