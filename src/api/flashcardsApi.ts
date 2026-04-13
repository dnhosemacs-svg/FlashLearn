import { apiClient } from './client'
import type { Flashcard, UpdateFlashcardInput } from '../types/domain'

export interface CreateFlashcardApiInput {
  collectionId: string
  question: string
  answer: string
  tags?: string[]
}

export function getFlashcards(collectionId?: string, signal?: AbortSignal): Promise<Flashcard[]> {
  const query = collectionId ? `?collectionId=${encodeURIComponent(collectionId)}` : ''
  return apiClient.get<Flashcard[]>(`/flashcards${query}`, signal)
}

export function getFlashcardById(id: string, signal?: AbortSignal): Promise<Flashcard> {
  return apiClient.get<Flashcard>(`/flashcards/${id}`, signal)
}

export function postFlashcard(
  input: CreateFlashcardApiInput,
  signal?: AbortSignal,
): Promise<Flashcard> {
  return apiClient.post<Flashcard, CreateFlashcardApiInput>('/flashcards', input, signal)
}

export function patchFlashcard(
  id: string,
  input: UpdateFlashcardInput,
  signal?: AbortSignal,
): Promise<Flashcard> {
  return apiClient.patch<Flashcard, UpdateFlashcardInput>(`/flashcards/${id}`, input, signal)
}

export function deleteFlashcard(id: string, signal?: AbortSignal): Promise<null> {
  return apiClient.delete<null>(`/flashcards/${id}`, signal)
}