const COLLECTIONS_SEARCH_KEY = 'flashlearn.ui.collections.search'

export function loadCollectionsSearch(): string {
  return localStorage.getItem(COLLECTIONS_SEARCH_KEY) ?? ''
}

export function saveCollectionsSearch(value: string): void {
  localStorage.setItem(COLLECTIONS_SEARCH_KEY, value)
}
