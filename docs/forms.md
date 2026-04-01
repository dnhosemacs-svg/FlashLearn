# Formularios de FlashLearn

Este documento describe los formularios activos del MVP, sus reglas de validacion, contratos de datos y comportamiento en modo crear/editar.

---

## Formularios incluidos

| Formulario | Archivo | Dominio |
|---|---|---|
| `CollectionForm` | `src/components/features/collections/CollectionForm.tsx` | Colecciones |
| `FlashcardForm` | `src/components/features/flashcards/FlashcardForm.tsx` | Flashcards |

---

## `CollectionForm`

### Objetivo

Crear una nueva coleccion o editar una existente con validacion minima.

### Props clave

- `onSubmit: (data: CreateCollectionInput) => void`
- `mode?: 'create' | 'edit'`
- `initialValues?: { name: string; description?: string }`
- `submitLabel?: string`
- `onCancel?: () => void`
- `isSubmitting?: boolean`

### Campos

- `name` (obligatorio)
- `description` (opcional)

### Validacion

- `name.trim()` no puede estar vacio.
- Si falla, muestra error: `El nombre es obligatorio`.
- `description` se guarda como `undefined` si queda vacio tras `trim`.

### Contrato de salida (`onSubmit`)

```ts
{
  name: string
  description?: string
}
```

### Comportamiento por modo

- `create`:
  - Al enviar correctamente, limpia inputs.
- `edit`:
  - Carga `initialValues`.
  - No limpia automaticamente tras enviar.
  - Muestra boton de cancelacion si existe `onCancel`.

---

## `FlashcardForm`

### Objetivo

Crear flashcards dentro de una coleccion.

### Props clave

- `onSubmit: (data: CreateFlashcardInput) => void`

### Campos

- `question` (obligatorio)
- `answer` (obligatorio)
- `tagsText` (opcional, entrada separada por comas)

### Validacion

- `question.trim()` obligatorio.
- `answer.trim()` obligatorio.
- Si alguno falla, se muestran mensajes:
  - `La pregunta es obligatoria`
  - `La respuesta es obligatoria`

### Transformacion de tags

- `tagsText` se divide por coma.
- Cada valor se normaliza con `trim()`.
- Se eliminan valores vacios.
- Si no hay tags validos, se envia `tags: undefined`.

### Contrato de salida (`onSubmit`)

```ts
{
  question: string
  answer: string
  tags?: string[]
}
```

### Comportamiento tras envio valido

- Limpia `question`, `answer` y `tagsText`.

---

## Reglas transversales de formularios (MVP)

- La validacion actual es de UI (cliente), minima y sin librerias externas.
- El estado del formulario vive dentro del propio componente.
- Los formularios no llaman API directamente: delegan por `onSubmit`.
- Los datos enviados ya salen normalizados (`trim`, opcionales como `undefined`).
