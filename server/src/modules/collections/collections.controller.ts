import type { Request, Response } from 'express'
import {
  createCollection,
  deleteCollection,
  getCollectionById,
  listCollections,
  updateCollection,
} from './collections.service.js'
import { validateCreateCollection, validateUpdateCollection } from './collections.validation.js'

function getCollections(_req: Request, res: Response) {
  res.status(200).json(listCollections())
}

function getCollection(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const found = getCollectionById(id)
  if (!found) return res.status(404).json({ message: 'Colección no encontrada' })
  return res.status(200).json(found)
}

function postCollection(req: Request, res: Response) {
  const parsed = validateCreateCollection(req.body)
  if (!parsed.ok) return res.status(400).json({ message: parsed.error })

  const created = createCollection(parsed.data)
  if (!created.ok) return res.status(409).json({ message: created.error })

  return res.status(201).json(created.data)
}

function patchCollection(req: Request, res: Response) {
  const parsed = validateUpdateCollection(req.body)
  if (!parsed.ok) return res.status(400).json({ message: parsed.error })

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const updated = updateCollection(id, parsed.data)
  if (!updated.ok) {
    const code = updated.error.includes('no encontrada') ? 404 : 409
    return res.status(code).json({ message: updated.error })
  }

  return res.status(200).json(updated.data)
}

function removeCollection(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const ok = deleteCollection(id)
  if (!ok) return res.status(404).json({ message: 'Colección no encontrada' })
  return res.status(204).send()
}

export { getCollection, getCollections, patchCollection, postCollection, removeCollection }