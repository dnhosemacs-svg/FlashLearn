import { Router } from 'express'
import {
  getCollection,
  getCollections,
  patchCollection,
  postCollection,
  removeCollection,
} from './collections.controller.js'

const collectionsRouter = Router()

collectionsRouter.get('/collections', getCollections)
collectionsRouter.get('/collections/:id', getCollection)
collectionsRouter.post('/collections', postCollection)
collectionsRouter.patch('/collections/:id', patchCollection)
collectionsRouter.delete('/collections/:id', removeCollection)

export default collectionsRouter
