import cors from 'cors'
import express from 'express'
import { env } from '../config/env.js'
import apiRouter from '../modules/index.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use(env.apiPrefix, apiRouter)

  return app
}
