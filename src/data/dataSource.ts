import * as collectionsApi from '../api/collectionsApi'
import * as flashcardsApi from '../api/flashcardsApi'
import * as mock from './mockDataSource'

const dataMode = import.meta.env.VITE_DATA_MODE ?? 'mock'
const useMock = dataMode === 'mock'

export const getCollections = useMock ? mock.getCollections : collectionsApi.getCollections
export const postCollection = useMock ? mock.postCollection : collectionsApi.postCollection
export const patchCollection = useMock ? mock.patchCollection : collectionsApi.patchCollection
export const deleteCollection = useMock ? mock.deleteCollection : collectionsApi.deleteCollection

export const getFlashcards = useMock ? mock.getFlashcards : flashcardsApi.getFlashcards
export const postFlashcard = useMock ? mock.postFlashcard : flashcardsApi.postFlashcard
export const patchFlashcard = useMock ? mock.patchFlashcard : flashcardsApi.patchFlashcard
export const deleteFlashcard = useMock ? mock.deleteFlashcard : flashcardsApi.deleteFlashcard
