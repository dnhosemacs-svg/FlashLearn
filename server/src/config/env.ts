// Configuración mínima de entorno con defaults seguros para desarrollo local.
export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPrefix: '/api/v1',
}
