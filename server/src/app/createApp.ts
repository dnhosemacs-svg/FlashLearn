import cors from 'cors'
import express from 'express'
import { env } from '../config/env.js'
import apiRouter from '../modules/index.js'
import errorHandler from '../shared/error.middleware.js'

export function createApp() {
  const app = express()

  // Middlewares globales del servidor.
  app.use(cors())
  app.use(express.json())

  // Se monta la API versionada y luego el manejador de errores.
  app.use(env.apiPrefix, apiRouter)
  app.use(errorHandler)

  return app
}
