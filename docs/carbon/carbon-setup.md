# Carbon Setup (Fase 10)

## Dependencias instaladas

- `@carbon/react`
- `@carbon/styles`
- `@carbon/icons-react`
- `@emotion/react`

## Integración base

1. Dependencias instaladas en frontend con npm.
2. Setup visual pendiente de aplicar en:
   - `src/index.css` (carga global de estilos Carbon)
   - `src/main.tsx` (provider de tema Carbon)

## Validación técnica

Comandos para validar compatibilidad tras el setup completo:

- `npm run lint`
- `npm run build`
- `npm run dev`

Checklist de verificación:

- Rutas principales sin regresión (`/`, `/collections`, `/collections/:collectionRef`, `/study`)
- Estado de hooks/context sin cambios funcionales
- CRUD y flujo de Study operativos
