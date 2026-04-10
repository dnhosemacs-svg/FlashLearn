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
    collectionId: string
    question: string
    answer: string
    tags?: string[]
  }
  
  export interface UpdateFlashcardInput {
    question: string
    answer: string
    tags?: string[]
  }