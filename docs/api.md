# API de FlashLearn (v1)

## Objetivo

Definir el contrato inicial de la API REST para el MVP de FlashLearn, usando dos recursos principales:

- `collections`
- `flashcards`

Base URL:

- `/api/v1`

---

## Recursos y alcance minimo (MVP)

### 1) Recurso `collections`

Representa una coleccion de estudio (tema o asignatura) que agrupa tarjetas.

Campos minimos:

- `id: string`
- `name: string`
- `description?: string`
- `createdAt: string` (ISO 8601)
- `updatedAt: string` (ISO 8601)

Operaciones MVP:

- crear coleccion
- listar colecciones
- obtener detalle de una coleccion
- editar coleccion
- eliminar coleccion

### 2) Recurso `flashcards`

Representa una tarjeta de estudio asociada a una coleccion.

Campos minimos:

- `id: string`
- `collectionId: string`
- `question: string`
- `answer: string`
- `tags?: string[]`
- `createdAt: string` (ISO 8601)
- `updatedAt: string` (ISO 8601)

Operaciones MVP:

- crear tarjeta en coleccion
- listar tarjetas por coleccion
- editar tarjeta
- eliminar tarjeta

### Relacion entre recursos

- Una `collection` tiene muchas `flashcards` (1:N).
- Cada `flashcard` pertenece exactamente a una `collection`.
- Al eliminar una `collection`, sus `flashcards` se eliminan en cascada (decision MVP).

---

## Endpoints MVP

### Collections

- `GET /api/v1/collections`
- `POST /api/v1/collections`
- `GET /api/v1/collections/:collectionId`
- `PATCH /api/v1/collections/:collectionId`
- `DELETE /api/v1/collections/:collectionId`

### Flashcards

- `GET /api/v1/collections/:collectionId/flashcards`
- `POST /api/v1/collections/:collectionId/flashcards`
- `PATCH /api/v1/flashcards/:flashcardId`
- `DELETE /api/v1/flashcards/:flashcardId`

---

## Contratos de entrada (DTOs)

### CreateCollectionDto

```json
{
  "name": "Programacion",
  "description": "Conceptos de TypeScript y React"
}
```

Reglas:

- `name` requerido, 2-80 caracteres.
- `description` opcional, maximo 280 caracteres.

### UpdateCollectionDto

```json
{
  "name": "Programacion Web",
  "description": "Actualizada"
}
```

Reglas:

- todos los campos opcionales
- si se envian, deben cumplir la misma validacion que en creacion

### CreateFlashcardDto

```json
{
  "question": "Que es useEffect?",
  "answer": "Un hook para efectos secundarios en React",
  "tags": ["react", "hooks"]
}
```

Reglas:

- `question` requerido, 1-300 caracteres.
- `answer` requerido, 1-1000 caracteres.
- `tags` opcional, array de strings.

### UpdateFlashcardDto

```json
{
  "question": "Que hace useMemo?",
  "answer": "Memoriza calculos costosos",
  "tags": ["react", "performance"]
}
```

Reglas:

- todos los campos opcionales
- si se envian, deben cumplir la validacion de creacion

---

## Formato de respuesta

### Exito

```json
{
  "ok": true,
  "data": {}
}
```

### Error

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo name es obligatorio"
  }
}
```

Codigos de error sugeridos:

- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`

---

## Codigos HTTP del MVP

- `200 OK`: lectura, actualizacion y borrado correctos
- `201 Created`: creacion correcta
- `400 Bad Request`: entrada invalida
- `404 Not Found`: recurso no encontrado
- `500 Internal Server Error`: error no controlado

---

## Codigos HTTP por endpoint

| Endpoint | 200 | 201 | 400 | 404 | 500 |
|---------|-----|-----|-----|-----|-----|
| `GET /api/v1/collections` | si | no | no | no | si |
| `POST /api/v1/collections` | no | si | si | no | si |
| `GET /api/v1/collections/:collectionId` | si | no | no | si | si |
| `PATCH /api/v1/collections/:collectionId` | si | no | si | si | si |
| `DELETE /api/v1/collections/:collectionId` | si | no | no | si | si |
| `GET /api/v1/collections/:collectionId/flashcards` | si | no | no | si | si |
| `POST /api/v1/collections/:collectionId/flashcards` | no | si | si | si | si |
| `PATCH /api/v1/flashcards/:flashcardId` | si | no | si | si | si |
| `DELETE /api/v1/flashcards/:flashcardId` | si | no | no | si | si |

Notas:

- En `DELETE`, tambien es valido devolver `204 No Content` si no se retorna cuerpo.
- Un `400` aplica cuando la ruta existe pero el body no cumple validaciones.
- Un `404` aplica cuando el recurso indicado por ID no existe.

---

## Fuera de alcance en este MVP

- autenticacion y usuarios
- sincronizacion multi-dispositivo
- estadisticas de aprendizaje
- compartir colecciones por enlace
- importacion/exportacion avanzada

Estas capacidades se evaluan en fases posteriores.

---

## Ejemplos request/response

### Collections

#### 1) Crear coleccion (exito)

Request:

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

Response `201 Created`:

```json
{
  "ok": true,
  "data": {
    "id": "col_001",
    "name": "React",
    "description": "Hooks y componentes",
    "createdAt": "2026-03-31T18:00:00.000Z",
    "updatedAt": "2026-03-31T18:00:00.000Z"
  }
}
```

#### 2) Crear coleccion (error de validacion)

Request:

```http
POST /api/v1/collections
Content-Type: application/json
```

```json
{
  "name": ""
}
```

Response `400 Bad Request`:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo name es obligatorio y debe tener al menos 2 caracteres"
  }
}
```

#### 3) Obtener coleccion por ID (no encontrada)

Request:

```http
GET /api/v1/collections/col_999
```

Response `404 Not Found`:

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Collection no encontrada"
  }
}
```

### Flashcards

#### 4) Crear flashcard en coleccion (exito)

Request:

```http
POST /api/v1/collections/col_001/flashcards
Content-Type: application/json
```

```json
{
  "question": "Que hace useMemo?",
  "answer": "Memoriza calculos para evitar recomputaciones innecesarias",
  "tags": ["react", "performance"]
}
```

Response `201 Created`:

```json
{
  "ok": true,
  "data": {
    "id": "fc_001",
    "collectionId": "col_001",
    "question": "Que hace useMemo?",
    "answer": "Memoriza calculos para evitar recomputaciones innecesarias",
    "tags": ["react", "performance"],
    "createdAt": "2026-03-31T18:05:00.000Z",
    "updatedAt": "2026-03-31T18:05:00.000Z"
  }
}
```

#### 5) Editar flashcard (error por ID inexistente)

Request:

```http
PATCH /api/v1/flashcards/fc_999
Content-Type: application/json
```

```json
{
  "answer": "Respuesta nueva"
}
```

Response `404 Not Found`:

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Flashcard no encontrada"
  }
}
```

#### 6) Listar flashcards por coleccion (exito)

Request:

```http
GET /api/v1/collections/col_001/flashcards
```

Response `200 OK`:

```json
{
  "ok": true,
  "data": [
    {
      "id": "fc_001",
      "collectionId": "col_001",
      "question": "Que hace useMemo?",
      "answer": "Memoriza calculos para evitar recomputaciones innecesarias",
      "tags": ["react", "performance"],
      "createdAt": "2026-03-31T18:05:00.000Z",
      "updatedAt": "2026-03-31T18:05:00.000Z"
    }
  ]
}
```
