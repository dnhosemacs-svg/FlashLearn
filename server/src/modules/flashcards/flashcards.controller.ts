import type { Request, Response } from 'express'
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcardById,
  listFlashcards,
  updateFlashcard,
} from './flashcards.service.js'
import { validateCreateFlashcard, validateUpdateFlashcard } from './flashcards.validation.js'

export function getFlashcards(req: Request, res: Response) {
  const collectionId = typeof req.query.collectionId === 'string' ? req.query.collectionId : undefined
  res.status(200).json(listFlashcards(collectionId))
}

export function getFlashcard(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const found = getFlashcardById(id)
  if (!found) return res.status(404).json({ message: 'Flashcard no encontrada' })
  return res.status(200).json(found)
}

export function postFlashcard(req: Request, res: Response) {
  const parsed = validateCreateFlashcard(req.body)
  if (!parsed.ok) return res.status(400).json({ message: parsed.error })

  const created = createFlashcard(parsed.data)
  if (!created.ok) return res.status(400).json({ message: created.error })

  return res.status(201).json(created.data)
}

export function patchFlashcard(req: Request, res: Response) {
  const parsed = validateUpdateFlashcard(req.body)
  if (!parsed.ok) return res.status(400).json({ message: parsed.error })

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const updated = updateFlashcard(id, parsed.data)
  if (!updated.ok) return res.status(404).json({ message: updated.error })

  return res.status(200).json(updated.data)
}

export function removeFlashcard(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const ok = deleteFlashcard(id)
  if (!ok) return res.status(404).json({ message: 'Flashcard no encontrada' })
  return res.status(204).send()
}