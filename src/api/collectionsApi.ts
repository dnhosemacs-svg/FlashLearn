import { apiClient } from './client'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '../types/domain'

export function getCollections(signal?: AbortSignal): Promise<Collection[]> {
  return apiClient.get<Collection[]>('/collections', signal)
}

export function getCollectionById(id: string, signal?: AbortSignal): Promise<Collection> {
  return apiClient.get<Collection>(`/collections/${id}`, signal)
}

export function postCollection(
  input: CreateCollectionInput,
  signal?: AbortSignal,
): Promise<Collection> {
  return apiClient.post<Collection, CreateCollectionInput>('/collections', input, signal)
}

export function patchCollection(
  id: string,
  input: UpdateCollectionInput,
  signal?: AbortSignal,
): Promise<Collection> {
  return apiClient.patch<Collection, UpdateCollectionInput>(`/collections/${id}`, input, signal)
}

export function deleteCollection(id: string, signal?: AbortSignal): Promise<null> {
  return apiClient.delete<null>(`/collections/${id}`, signal)
}