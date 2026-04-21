const COLLECTIONS_SEARCH_KEY = 'flashlearn.ui.collections.search'

export function loadCollectionsSearch(): string {
  // Recupera el último término usado en buscador de colecciones.
  return localStorage.getItem(COLLECTIONS_SEARCH_KEY) ?? ''
}

export function saveCollectionsSearch(value: string): void {
  // Persiste preferencia de búsqueda para mantener continuidad de UX.
  localStorage.setItem(COLLECTIONS_SEARCH_KEY, value)
}
