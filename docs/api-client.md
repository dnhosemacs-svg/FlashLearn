# API Client (frontend)

Documenta la capa de red usada por el frontend (`src/api`).

## Objetivo

- Centralizar llamadas HTTP en un cliente tipado.
- Unificar parseo de respuestas y manejo de errores.
- Exponer funciones de dominio por recurso (`collections`, `flashcards`).

---

## Diseño del cliente

### Estructura de archivos

- `src/api/client.ts`: cliente HTTP genérico (`apiClient`) + `HttpError`.
- `src/api/collectionsApi.ts`: operaciones de colecciones.
- `src/api/flashcardsApi.ts`: operaciones de flashcards.
- `src/types/api.ts`: contratos request/response y error.

### Base URL

La base URL se define en `src/api/client.ts`:

- `import.meta.env.VITE_API_BASE_URL`
- fallback: `http://localhost:4000/api/v1`

### Flujo de una request

1. `collectionsApi` / `flashcardsApi` llama a `apiClient`.
2. `apiClient` delega en `request<T>()`.
3. `request<T>()` ejecuta `fetch`.
4. Se parsea body con `parseResponseBody()`:
   - JSON si `content-type` incluye `application/json`
   - `null` en `204`
   - texto en otros casos
5. Si `response.ok === false`, se lanza `HttpError`.
6. Si OK, devuelve `parsedBody as T`.

---

## Tipos usados

### Error estándar del backend

Definido en `src/types/api.ts`:

- `ApiErrorResponse = { message: string }`

### Contratos por recurso

`src/types/api.ts` define:

- Collections:
  - `GetCollectionsResponse`
  - `GetCollectionByIdResponse`
  - `PostCollectionRequest/Response`
  - `PatchCollectionRequest/Response`
  - `DeleteCollectionResponse`
- Flashcards:
  - `GetFlashcardsResponse`
  - `GetFlashcardByIdResponse`
  - `PostFlashcardRequest/Response`
  - `PatchFlashcardRequest/Response`
  - `DeleteFlashcardResponse`
  - `GetFlashcardsQuery`

### Error de infraestructura frontend

`HttpError` en `src/api/client.ts` expone:

- `name: 'HttpError'`
- `message`
- `status`
- `body` (payload devuelto por backend)

---

## Estrategia de errores

### Comportamiento actual

- Todas las respuestas no-2xx lanzan `HttpError`.
- Si el body cumple `{ message: string }`, ese `message` se usa como mensaje de error.
- Si no, fallback a `HTTP <status>`.

### Manejo en UI

Hooks/páginas capturan errores y actualizan estado async:

- `status: 'error'`
- `error: error.message` si `instanceof Error`
- fallback de texto en español si no hay mensaje usable

### Abort/cancelación

Las funciones API aceptan `signal?: AbortSignal`, permitiendo cancelación desde capa superior cuando sea necesario.

---

## Estrategia de reintentos

### Estado actual

- No hay reintentos automáticos en `apiClient`.
- El reintento es manual desde UI con botón `Reintentar` y llamada a `refresh()`.

### Decisión de diseño (actual)

Se evita reintentar automáticamente para no duplicar escrituras en operaciones no idempotentes (`POST`, `PATCH`, `DELETE`).

### Recomendación para siguiente iteración

Si se implementan reintentos automáticos, limitar a:

- Solo métodos idempotentes (`GET`).
- Solo errores transitorios (red/`5xx`/`429`).
- Backoff exponencial con jitter.
- Máximo bajo de intentos (ej. 2 o 3).

---

## Ejemplo rápido de uso

```ts
import { getCollections } from '../api/collectionsApi'

const data = await getCollections()
```

```ts
import { HttpError } from '../api/client'

try {
  await getCollections()
} catch (error) {
  if (error instanceof HttpError) {
    console.error(error.status, error.message, error.body)
  }
}
```

---

## Notas de mantenimiento

- Mantener contratos en `src/types/api.ts` sincronizados con backend.
- Evitar `fetch` directo fuera de `src/api`.
- Cualquier cambio de estrategia de errores/reintentos debe reflejarse en este documento.
