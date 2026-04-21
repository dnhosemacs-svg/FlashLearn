import { getCollectionById } from '../collections/collections.service.js'
import type { CreateFlashcardInput, Flashcard, UpdateFlashcardInput } from './flashcards.types.js'

const flashcards: Flashcard[] = []

export function listFlashcards(collectionId?: string): Flashcard[] {
  // Soporta listado global o filtrado por colección.
  if (!collectionId) return flashcards
  return flashcards.filter((f) => f.collectionId === collectionId)
}

export function getFlashcardById(id: string): Flashcard | undefined {
  return flashcards.find((f) => f.id === id)
}

export function createFlashcard(input: CreateFlashcardInput): { ok: true; data: Flashcard } | { ok: false; error: string } {
  // Garantiza referencia válida a colección antes de crear.
  const existsCollection = getCollectionById(input.collectionId)
  if (!existsCollection) return { ok: false, error: 'collectionId no existe' }

  const now = new Date().toISOString()
  const flashcard: Flashcard = {
    id: crypto.randomUUID(),
    collectionId: input.collectionId,
    question: input.question,
    answer: input.answer,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
  }

  flashcards.unshift(flashcard)
  return { ok: true, data: flashcard }
}

export function updateFlashcard(id: string, input: UpdateFlashcardInput): { ok: true; data: Flashcard } | { ok: false; error: string } {
  const index = flashcards.findIndex((f) => f.id === id)
  if (index === -1) return { ok: false, error: 'Flashcard no encontrada' }

  const current = flashcards[index]
  const updated: Flashcard = {
    ...current,
    question: input.question,
    answer: input.answer,
    tags: input.tags,
    updatedAt: new Date().toISOString(),
  }

  flashcards[index] = updated
  return { ok: true, data: updated }
}

export function deleteFlashcard(id: string): boolean {
  const index = flashcards.findIndex((f) => f.id === id)
  if (index === -1) return false
  flashcards.splice(index, 1)
  return true
}

export function deleteFlashcardsByCollectionId(collectionId: string): void {
  // Recorre en reversa para eliminar en sitio sin perder índices.
  let i = flashcards.length - 1
  while (i >= 0) {
    if (flashcards[i].collectionId === collectionId) {
      flashcards.splice(i, 1)
    }
    i--
  }
}