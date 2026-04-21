import { Router } from 'express'
import { getHealth } from './health.controller.js'

const healthRouter = Router()

// Ruta sin estado para monitoreo externo.
healthRouter.get('/health', getHealth)

export default healthRouter
