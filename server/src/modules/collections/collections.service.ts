import type { Collection, CreateCollectionInput, UpdateCollectionInput } from './collections.types.js'
import { randomUUID } from 'node:crypto'
import { deleteFlashcardsByCollectionId } from '../flashcards/flashcards.service.js'

const collections: Collection[] = []

function normalizeName(name: string) {
  // Normalización para comparaciones de unicidad más robustas.
  return name.trim().toLowerCase()
}

export function listCollections(): Collection[] {
  return collections
}

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function createCollection(input: CreateCollectionInput): { ok: true; data: Collection } | { ok: false; error: string } {
  const duplicated = collections.some((c) => normalizeName(c.name) === normalizeName(input.name))
  if (duplicated) return { ok: false, error: 'Ya existe una colección con ese nombre' }

  const now = new Date().toISOString()
  const collection: Collection = {
    id: randomUUID(),
    name: input.name,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  }

  collections.unshift(collection)
  return { ok: true, data: collection }
}

export function updateCollection(id: string, input: UpdateCollectionInput): { ok: true; data: Collection } | { ok: false; error: string } {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return { ok: false, error: 'Colección no encontrada' }

  const duplicated = collections.some(
    (c) => c.id !== id && normalizeName(c.name) === normalizeName(input.name),
  )
  if (duplicated) return { ok: false, error: 'Ya existe una colección con ese nombre' }

  const current = collections[index]
  const updated: Collection = {
    ...current,
    name: input.name,
    description: input.description,
    updatedAt: new Date().toISOString(),
  }

  collections[index] = updated
  return { ok: true, data: updated }
}

export function deleteCollection(id: string): boolean {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return false
  collections.splice(index, 1)
  // Cascada manual para mantener integridad en store en memoria.
  deleteFlashcardsByCollectionId(id)
  return true
}