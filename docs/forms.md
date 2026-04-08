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
- `existingNames?: string[]` (para validación de duplicados)
- `currentName?: string` (solo en edición; evita “duplicado contra sí misma”)

### Campos

- `name` (obligatorio)
- `description` (opcional)

### Validacion

- `name.trim()` no puede estar vacio.
- Si falla, muestra error: `El nombre es obligatorio`.
- Duplicados básicos:
  - Normaliza el nombre con `trim().toLowerCase()`.
  - Si `existingNames` contiene el mismo nombre normalizado (y no es el propio `currentName` en modo edit), muestra:
    - `Ya existe una colección con ese nombre`
- `description` se guarda como `undefined` si queda vacio tras `trim`.

### Éxito / confirmación

- En envío válido muestra confirmación en verde:
  - `Colección creada correctamente.` (modo `create`)
  - `Colección actualizada correctamente.` (modo `edit`)

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
- `mode?: 'create' | 'edit'`
- `initialValues?: { question: string; answer: string; tags?: string[] }`
- `submitLabel?: string`
- `onCancel?: () => void`

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

### Éxito / confirmación

- En envío válido muestra confirmación en verde:
  - `Flashcard creada correctamente.` (modo `create`)
  - `Flashcard actualizada correctamente.` (modo `edit`)

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

- `create`: limpia `question`, `answer` y `tagsText`.
- `edit`: mantiene valores (para que el usuario vea lo guardado) y ofrece `Cancelar edición` si se proporciona `onCancel`.

---

## Casos de error y éxito (ejemplos rápidos)

### Colecciones

- **Error**: enviar con nombre vacío → aparece `El nombre es obligatorio`.
- **Error**: crear “react” si ya existe “React” → aparece `Ya existe una colección con ese nombre`.
- **Éxito**: crear nombre válido → aparece `Colección creada correctamente.` y se limpia el formulario.
- **Éxito (edit)**: guardar cambios → aparece `Colección actualizada correctamente.`.

### Flashcards

- **Error**: pregunta vacía → `La pregunta es obligatoria`.
- **Error**: respuesta vacía → `La respuesta es obligatoria`.
- **Éxito**: crear → `Flashcard creada correctamente.` y limpia campos.
- **Éxito (edit)**: guardar → `Flashcard actualizada correctamente.`.

---

## Ejemplos prácticos (integración)

### `CollectionsPage` — pasar nombres existentes

```tsx
<CollectionForm
  onSubmit={create}
  existingNames={collections.map((c) => c.name)}
/>
```

En edición:

```tsx
<CollectionForm
  mode="edit"
  initialValues={{ name: editingCollection.name, description: editingCollection.description }}
  onSubmit={handleUpdateCollection}
  onCancel={handleCancelEdit}
  existingNames={collections.map((c) => c.name)}
  currentName={editingCollection.name}
/>
```

### `CollectionDetailPage` — crear vs editar flashcard

```tsx
{editingFlashcard ? (
  <FlashcardForm
    mode="edit"
    initialValues={{
      question: editingFlashcard.question,
      answer: editingFlashcard.answer,
      tags: editingFlashcard.tags,
    }}
    onSubmit={handleUpdateFlashcard}
    onCancel={handleCancelEditFlashcard}
  />
) : (
  <FlashcardForm onSubmit={handleCreateFlashcard} />
)}
```

---

## Reglas transversales de formularios (MVP)

- La validacion actual es de UI (cliente), minima y sin librerias externas.
- El estado del formulario vive dentro del propio componente.
- Los formularios no llaman API directamente: delegan por `onSubmit`.
- Los datos enviados ya salen normalizados (`trim`, opcionales como `undefined`).
