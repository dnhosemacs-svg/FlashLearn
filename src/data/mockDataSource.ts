import type {
  Collection,
  CreateCollectionInput,
  CreateFlashcardInput,
  Flashcard,
  UpdateCollectionInput,
  UpdateFlashcardInput,
} from '../types/domain'

const COLLECTION_IDS = {
  english: 'col-english',
  capitals: 'col-capitals',
} as const

const BASE_TIMESTAMP = '2026-04-22T12:00:00.000Z'

const seededCollections: Collection[] = [
  {
    id: COLLECTION_IDS.english,
    name: 'Ingles',
    description: 'Vocabulario basico de espanol a ingles',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
  {
    id: COLLECTION_IDS.capitals,
    name: 'Capitales del mundo',
    description: 'Relacion pais-capital para practicar geografia',
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  },
]

const englishWords: Array<{ question: string; answer: string }> = [
  { question: 'hola', answer: 'hello' },
  { question: 'adios', answer: 'goodbye' },
  { question: 'gracias', answer: 'thank you' },
  { question: 'por favor', answer: 'please' },
  { question: 'perro', answer: 'dog' },
  { question: 'gato', answer: 'cat' },
  { question: 'casa', answer: 'house' },
  { question: 'escuela', answer: 'school' },
  { question: 'comida', answer: 'food' },
  { question: 'agua', answer: 'water' },
  { question: 'libro', answer: 'book' },
  { question: 'mesa', answer: 'table' },
  { question: 'silla', answer: 'chair' },
  { question: 'coche', answer: 'car' },
  { question: 'ciudad', answer: 'city' },
  { question: 'amigo', answer: 'friend' },
  { question: 'familia', answer: 'family' },
  { question: 'trabajo', answer: 'work' },
  { question: 'tiempo', answer: 'time' },
  { question: 'dinero', answer: 'money' },
]

const worldCapitals: Array<{ question: string; answer: string }> = [
  { question: 'Espana', answer: 'Madrid' },
  { question: 'Francia', answer: 'Paris' },
  { question: 'Italia', answer: 'Roma' },
  { question: 'Portugal', answer: 'Lisboa' },
  { question: 'Alemania', answer: 'Berlin' },
  { question: 'Argentina', answer: 'Buenos Aires' },
  { question: 'Mexico', answer: 'Ciudad de Mexico' },
  { question: 'Japon', answer: 'Tokio' },
  { question: 'Canada', answer: 'Ottawa' },
  { question: 'Australia', answer: 'Canberra' },
]

function buildSeededFlashcards(): Flashcard[] {
  const englishCards = englishWords.map((entry, index) => ({
    id: `fc-en-${index + 1}`,
    collectionId: COLLECTION_IDS.english,
    question: entry.question,
    answer: entry.answer,
    tags: ['ingles'],
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  }))

  const capitalsCards = worldCapitals.map((entry, index) => ({
    id: `fc-cap-${index + 1}`,
    collectionId: COLLECTION_IDS.capitals,
    question: entry.question,
    answer: entry.answer,
    tags: ['geografia'],
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
  }))

  return [...englishCards, ...capitalsCards]
}

let collectionsStore: Collection[] = [...seededCollections]
let flashcardsStore: Flashcard[] = buildSeededFlashcards()

function nowIso(): string {
  return new Date().toISOString()
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function randomId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function getCollections(): Promise<Collection[]> {
  return Promise.resolve(clone(collectionsStore))
}

export function getCollectionById(id: string): Promise<Collection> {
  const collection = collectionsStore.find((item) => item.id === id)
  if (!collection) {
    throw new Error(`Collection ${id} not found`)
  }

  return Promise.resolve(clone(collection))
}

export function postCollection(input: CreateCollectionInput): Promise<Collection> {
  const timestamp = nowIso()
  const created: Collection = {
    id: randomId('col'),
    name: input.name,
    description: input.description,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  collectionsStore = [created, ...collectionsStore]
  return Promise.resolve(clone(created))
}

export function patchCollection(id: string, input: UpdateCollectionInput): Promise<Collection> {
  const existing = collectionsStore.find((item) => item.id === id)
  if (!existing) {
    throw new Error(`Collection ${id} not found`)
  }

  const updated: Collection = {
    ...existing,
    name: input.name,
    description: input.description,
    updatedAt: nowIso(),
  }

  collectionsStore = collectionsStore.map((item) => (item.id === id ? updated : item))
  return Promise.resolve(clone(updated))
}

export function deleteCollection(id: string): Promise<null> {
  collectionsStore = collectionsStore.filter((item) => item.id !== id)
  flashcardsStore = flashcardsStore.filter((item) => item.collectionId !== id)
  return Promise.resolve(null)
}

export function getFlashcards(collectionId?: string): Promise<Flashcard[]> {
  const data = collectionId
    ? flashcardsStore.filter((card) => card.collectionId === collectionId)
    : flashcardsStore
  return Promise.resolve(clone(data))
}

export function getFlashcardById(id: string): Promise<Flashcard> {
  const flashcard = flashcardsStore.find((item) => item.id === id)
  if (!flashcard) {
    throw new Error(`Flashcard ${id} not found`)
  }

  return Promise.resolve(clone(flashcard))
}

export function postFlashcard(
  input: CreateFlashcardInput & { collectionId: string },
): Promise<Flashcard> {
  const timestamp = nowIso()
  const created: Flashcard = {
    id: randomId('fc'),
    collectionId: input.collectionId,
    question: input.question,
    answer: input.answer,
    tags: input.tags ?? [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  flashcardsStore = [created, ...flashcardsStore]
  return Promise.resolve(clone(created))
}

export function patchFlashcard(id: string, input: UpdateFlashcardInput): Promise<Flashcard> {
  const existing = flashcardsStore.find((item) => item.id === id)
  if (!existing) {
    throw new Error(`Flashcard ${id} not found`)
  }

  const updated: Flashcard = {
    ...existing,
    question: input.question,
    answer: input.answer,
    tags: input.tags ?? [],
    updatedAt: nowIso(),
  }

  flashcardsStore = flashcardsStore.map((item) => (item.id === id ? updated : item))
  return Promise.resolve(clone(updated))
}

export function deleteFlashcard(id: string): Promise<null> {
  flashcardsStore = flashcardsStore.filter((item) => item.id !== id)
  return Promise.resolve(null)
}
