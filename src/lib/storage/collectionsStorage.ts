import type { Collection } from '../../types/domain'

export const COLLECTIONS_STORAGE_KEY = 'flashlearn.collections'

export function loadStoredCollections(): Collection[] {
  const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? (parsed as Collection[]) : []
  } catch {
    return []
  }
}

export function saveCollections(collections: Collection[]): void {
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
}
