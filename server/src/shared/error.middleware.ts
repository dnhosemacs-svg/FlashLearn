import type { NextFunction, Request, Response } from 'express'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('[API_ERROR]', err)

  return res.status(500).json({
    message: 'Error interno del servidor',
  })
}

export default errorHandler