# API de FlashLearn (v1)

Documentación del contrato backend actual en `server/`.

- Base URL: `/api/v1`
- Formato de respuesta actual:
  - éxito: objeto o array JSON directo
  - error: `{ "message": "..." }`

---

## Tabla de endpoints

| Método | Endpoint | Descripción | Códigos |
|---|---|---|---|
| GET | `/api/v1/health` | Estado del servicio | `200`, `500` |
| GET | `/api/v1/collections` | Listar colecciones | `200`, `500` |
| POST | `/api/v1/collections` | Crear colección | `201`, `400`, `409`, `500` |
| GET | `/api/v1/collections/:id` | Obtener colección por id | `200`, `404`, `500` |
| PATCH | `/api/v1/collections/:id` | Actualizar colección | `200`, `400`, `404`, `409`, `500` |
| DELETE | `/api/v1/collections/:id` | Borrar colección (cascada de flashcards) | `204`, `404`, `500` |
| GET | `/api/v1/flashcards` | Listar flashcards (opcional filtro `collectionId`) | `200`, `500` |
| GET | `/api/v1/flashcards/:id` | Obtener flashcard por id | `200`, `404`, `500` |
| POST | `/api/v1/flashcards` | Crear flashcard | `201`, `400`, `404`, `500` |
| PATCH | `/api/v1/flashcards/:id` | Actualizar flashcard | `200`, `400`, `404`, `500` |
| DELETE | `/api/v1/flashcards/:id` | Borrar flashcard | `204`, `404`, `500` |

---

## Ejemplos request/response

### Health

```http
GET /api/v1/health
```

`200 OK`

```json
{
  "ok": true,
  "service": "flashlearn-api",
  "timestamp": "2026-04-10T07:35:32.709Z"
}
```

### Collections

#### Crear colección

```http
POST /api/v1/collections
Content-Type: application/json
```

```json
{
  "name": "React",
  "description": "Hooks y componentes"
}
```

`201 Created`

```json
{
  "id": "ab83bed9-28cb-4909-9d72-3e7e6082922e",
  "name": "React",
  "description": "Hooks y componentes",
  "createdAt": "2026-04-10T07:35:32.709Z",
  "updatedAt": "2026-04-10T07:35:32.709Z"
}
```

#### Listar colecciones

```http
GET /api/v1/collections
```

`200 OK`

```json
[
  {
    "id": "ab83bed9-28cb-4909-9d72-3e7e6082922e",
    "name": "React",
    "description": "Hooks y componentes",
    "createdAt": "2026-04-10T07:35:32.709Z",
    "updatedAt": "2026-04-10T07:35:32.709Z"
  }
]
```

### Flashcards

#### Crear flashcard

```http
POST /api/v1/flashcards
Content-Type: application/json
```

```json
{
  "collectionId": "ab83bed9-28cb-4909-9d72-3e7e6082922e",
  "question": "¿Qué hace useMemo?",
  "answer": "Memoriza cálculos",
  "tags": ["react", "hooks"]
}
```

`201 Created`

```json
{
  "id": "f4f3a32c-bd5a-447f-a5f2-d5c8964f6a9e",
  "collectionId": "ab83bed9-28cb-4909-9d72-3e7e6082922e",
  "question": "¿Qué hace useMemo?",
  "answer": "Memoriza cálculos",
  "tags": ["react", "hooks"],
  "createdAt": "2026-04-10T07:40:00.000Z",
  "updatedAt": "2026-04-10T07:40:00.000Z"
}
```

#### Listar flashcards por colección

```http
GET /api/v1/flashcards?collectionId=ab83bed9-28cb-4909-9d72-3e7e6082922e
```

`200 OK`

```json
[
  {
    "id": "f4f3a32c-bd5a-447f-a5f2-d5c8964f6a9e",
    "collectionId": "ab83bed9-28cb-4909-9d72-3e7e6082922e",
    "question": "¿Qué hace useMemo?",
    "answer": "Memoriza cálculos",
    "tags": ["react", "hooks"],
    "createdAt": "2026-04-10T07:40:00.000Z",
    "updatedAt": "2026-04-10T07:40:00.000Z"
  }
]
```

---

## Errores y códigos posibles

### `400 Bad Request` (validación)

Se devuelve cuando el body no cumple validación.

```json
{
  "message": "name es obligatorio"
}
```

Ejemplos:
- `POST /collections` sin `name`
- `POST /flashcards` sin `question` o `answer`

### `404 Not Found`

Se devuelve cuando no existe el recurso solicitado.

```json
{
  "message": "Colección no encontrada"
}
```

Ejemplos:
- `GET /collections/:id` inexistente
- `POST /flashcards` con `collectionId` inexistente
- `PATCH/DELETE /flashcards/:id` inexistente

### `409 Conflict`

Se devuelve en conflicto de negocio de colecciones (nombre duplicado).

```json
{
  "message": "Ya existe una colección con ese nombre"
}
```

### `500 Internal Server Error`

Error no controlado capturado por middleware global.

```json
{
  "message": "Error interno del servidor"
}
```

---

## Notas de dominio

- Relación `collections` -> `flashcards` es 1:N.
- Borrado en cascada: al eliminar una colección, se eliminan sus flashcards asociadas.
- Persistencia actual: en memoria del proceso backend (sin base de datos todavía).
