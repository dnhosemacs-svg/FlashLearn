import type { Request, Response } from 'express'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
) {
  // Fallback centralizado para errores no controlados en controladores/servicios.
  console.error('[API_ERROR]', err)

  return res.status(500).json({
    message: 'Error interno del servidor',
  })
}

export default errorHandler