import type { Request, Response } from 'express'
import { getHealthStatus } from './health.service.js'

export function getHealth(_req: Request, res: Response): void {
  // Endpoint de liveness/readiness básico.
  res.status(200).json(getHealthStatus())
}
