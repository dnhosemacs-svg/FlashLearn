// Barrel de API para centralizar imports en el resto de módulos.
export { apiClient, HttpError } from './client'

export {
  getCollections,
  getCollectionById,
  postCollection,
  patchCollection,
  deleteCollection,
} from './collectionsApi'

export {
  getFlashcards,
  getFlashcardById,
  postFlashcard,
  patchFlashcard,
  deleteFlashcard,
} from './flashcardsApi'