import type {
    Collection,
    CreateCollectionInput,
    Flashcard,
    UpdateCollectionInput,
    UpdateFlashcardInput,
  } from './domain'
  
  /** Error estándar que responde el backend: { message: string } */
  export interface ApiErrorResponse {
    message: string
  }
  
  /** Query params */
  export interface GetFlashcardsQuery {
    collectionId?: string
  }
  
  /** Contracts Collections */
  export type GetCollectionsResponse = Collection[]
  export type GetCollectionByIdResponse = Collection
  export type PostCollectionRequest = CreateCollectionInput
  export type PostCollectionResponse = Collection
  export type PatchCollectionRequest = UpdateCollectionInput
  export type PatchCollectionResponse = Collection
  export type DeleteCollectionResponse = null
  
  /** Contracts Flashcards */
  export interface PostFlashcardRequest {
    collectionId: string
    question: string
    answer: string
    tags?: string[]
  }
  
  export type GetFlashcardsResponse = Flashcard[]
  export type GetFlashcardByIdResponse = Flashcard
  export type PostFlashcardResponse = Flashcard
  export type PatchFlashcardRequest = UpdateFlashcardInput
  export type PatchFlashcardResponse = Flashcard
  export type DeleteFlashcardResponse = null