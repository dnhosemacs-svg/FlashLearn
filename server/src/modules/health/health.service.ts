export interface HealthPayload {
  ok: boolean
  service: string
  timestamp: string
}

export function getHealthStatus(): HealthPayload {
  return {
    ok: true,
    service: 'flashlearn-api',
    timestamp: new Date().toISOString(),
  }
}
