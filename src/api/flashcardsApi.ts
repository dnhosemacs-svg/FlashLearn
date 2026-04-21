import { apiClient } from './client'
import type {
  DeleteFlashcardResponse,
  GetFlashcardByIdResponse,
  GetFlashcardsResponse,
  PatchFlashcardRequest,
  PatchFlashcardResponse,
  PostFlashcardRequest,
  PostFlashcardResponse,
} from '../types/api'

// Capa de acceso a API de flashcards y su parametrización por colección.
export function getFlashcards(collectionId?: string, signal?: AbortSignal): Promise<GetFlashcardsResponse> {
  const query = collectionId ? `?collectionId=${encodeURIComponent(collectionId)}` : ''
  return apiClient.get<GetFlashcardsResponse>(`/flashcards${query}`, signal)
}

export function getFlashcardById(id: string, signal?: AbortSignal): Promise<GetFlashcardByIdResponse> {
  return apiClient.get<GetFlashcardByIdResponse>(`/flashcards/${id}`, signal)
}

export function postFlashcard(
  input: PostFlashcardRequest,
  signal?: AbortSignal,
): Promise<PostFlashcardResponse> {
  return apiClient.post<PostFlashcardResponse, PostFlashcardRequest>('/flashcards', input, signal)
}

export function patchFlashcard(
  id: string,
  input: PatchFlashcardRequest,
  signal?: AbortSignal,
): Promise<PatchFlashcardResponse> {
  return apiClient.patch<PatchFlashcardResponse, PatchFlashcardRequest>(`/flashcards/${id}`, input, signal)
}

export function deleteFlashcard(id: string, signal?: AbortSignal): Promise<DeleteFlashcardResponse> {
  return apiClient.delete<DeleteFlashcardResponse>(`/flashcards/${id}`, signal)
}