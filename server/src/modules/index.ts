import { Router } from 'express'
import healthRouter from './health/health.routes.js'

const apiRouter = Router()

apiRouter.use(healthRouter)

export default apiRouter
