import { Router } from 'express'
import {
  getFlashcard,
  getFlashcards,
  patchFlashcard,
  postFlashcard,
  removeFlashcard,
} from './flashcards.controller.js'

const flashcardsRouter = Router()

// Rutas REST del recurso flashcard.
flashcardsRouter.get('/flashcards', getFlashcards)
flashcardsRouter.get('/flashcards/:id', getFlashcard)
flashcardsRouter.post('/flashcards', postFlashcard)
flashcardsRouter.patch('/flashcards/:id', patchFlashcard)
flashcardsRouter.delete('/flashcards/:id', removeFlashcard)

export default flashcardsRouter