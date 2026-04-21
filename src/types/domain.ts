// Entidades y payloads de dominio compartidos entre UI, hooks y API client.
export interface Collection {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCollectionInput {
  name: string
  description?: string
}

export interface UpdateCollectionInput {
  name: string
  description?: string
}

export interface Flashcard {
  id: string
  collectionId: string
  question: string
  answer: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateFlashcardInput {
  question: string
  answer: string
  tags?: string[]
}

export interface UpdateFlashcardInput {
  question: string
  answer: string
  tags?: string[]
}