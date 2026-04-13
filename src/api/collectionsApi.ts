import { apiClient } from './client'
import type {
  DeleteCollectionResponse,
  GetCollectionByIdResponse,
  GetCollectionsResponse,
  PatchCollectionRequest,
  PatchCollectionResponse,
  PostCollectionRequest,
  PostCollectionResponse,
} from '../types/api'

export function getCollections(signal?: AbortSignal): Promise<GetCollectionsResponse> {
  return apiClient.get<GetCollectionsResponse>('/collections', signal)
}

export function getCollectionById(id: string, signal?: AbortSignal): Promise<GetCollectionByIdResponse> {
  return apiClient.get<GetCollectionByIdResponse>(`/collections/${id}`, signal)
}

export function postCollection(
  input: PostCollectionRequest,
  signal?: AbortSignal,
): Promise<PostCollectionResponse> {
  return apiClient.post<PostCollectionResponse, PostCollectionRequest>('/collections', input, signal)
}

export function patchCollection(
  id: string,
  input: PatchCollectionRequest,
  signal?: AbortSignal,
): Promise<PatchCollectionResponse> {
  return apiClient.patch<PatchCollectionResponse, PatchCollectionRequest>(`/collections/${id}`, input, signal)
}

export function deleteCollection(id: string, signal?: AbortSignal): Promise<DeleteCollectionResponse> {
  return apiClient.delete<DeleteCollectionResponse>(`/collections/${id}`, signal)
}