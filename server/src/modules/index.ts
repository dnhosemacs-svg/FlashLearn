import { Router } from 'express'
import healthRouter from './health/health.routes.js'
import collectionsRouter from './collections/collections.routes.js'
import flashcardsRouter from './flashcards/flashcards.routes.js'

const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use(collectionsRouter)
apiRouter.use(flashcardsRouter)

export default apiRouter
