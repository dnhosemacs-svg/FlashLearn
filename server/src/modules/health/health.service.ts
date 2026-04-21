export interface HealthPayload {
  ok: boolean
  service: string
  timestamp: string
}

export function getHealthStatus(): HealthPayload {
  // Respuesta autocontenida para comprobar disponibilidad del servicio.
  return {
    ok: true,
    service: 'flashlearn-api',
    timestamp: new Date().toISOString(),
  }
}
