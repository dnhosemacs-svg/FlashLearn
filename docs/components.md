# Componentes de FlashLearn

Este documento describe los componentes actuales del proyecto, sus props principales, ejemplos de uso y escenarios de reutilizacion.

---

## Tabla de componentes

| Componente | Capa | Responsabilidad | Ubicacion |
|---|---|---|---|
| `Button` | UI | Acciones primarias/secundarias con variantes y tamanos | `src/components/ui/Button.tsx` |
| `Input` | UI | Campo de texto con label, hint y error | `src/components/ui/Input.tsx` |
| `Card` | UI | Contenedor visual base para bloques de contenido | `src/components/ui/Card.tsx` |
| `Alert` | UI | Mensajes de estado/error con accion opcional | `src/components/ui/Alert.tsx` |
| `EmptyState` | UI | Estado vacio para listas o vistas sin datos | `src/components/ui/EmptyState.tsx` |
| `Badge` | UI | Etiquetas visuales compactas por estado/tipo | `src/components/ui/Badge.tsx` |
| `Spinner` | UI | Indicador de carga visual | `src/components/ui/Spinner.tsx` |
| `Modal` | UI | Dialogo modal reusable (overlay + contenido + footer) | `src/components/ui/Modal.tsx` |
| `CollectionForm` | Feature (`collections`) | Crear/editar colecciones con validacion minima | `src/components/features/collections/CollectionForm.tsx` |
| `CollectionItem` | Feature (`collections`) | Render de tarjeta de coleccion con acciones | `src/components/features/collections/CollectionItem.tsx` |
| `CollectionList` | Feature (`collections`) | Listado de colecciones + estado vacio | `src/components/features/collections/CollectionList.tsx` |
| `FlashcardForm` | Feature (`flashcards`) | Crear flashcards con validacion de pregunta/respuesta | `src/components/features/flashcards/FlashcardForm.tsx` |
| `FlashcardItem` | Feature (`flashcards`) | Render de flashcard con tags y acciones | `src/components/features/flashcards/FlashcardItem.tsx` |
| `FlashcardList` | Feature (`flashcards`) | Listado de flashcards + estado vacio | `src/components/features/flashcards/FlashcardList.tsx` |
| `StudyCard` | Feature (`study`) | Tarjeta activa de estudio (pregunta/respuesta) | `src/components/features/study/StudyCard.tsx` |
| `StudyControls` | Feature (`study`) | Controles de sesion de estudio (anterior/siguiente/revelar/barajar) | `src/components/features/study/StudyControls.tsx` |

---

## Props y ejemplos de uso

> Nota: se muestran props clave de uso frecuente. El detalle completo se consulta en cada archivo TSX.

### UI

#### `Button`

Props clave:

- `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- `isLoading?: boolean`
- `fullWidth?: boolean`

Ejemplo:

```tsx
<Button variant="primary" size="md">Guardar</Button>
<Button variant="danger" size="sm" onClick={onDelete}>Borrar</Button>
```

#### `Input`

Props clave:

- `label?: string`
- `error?: string`
- `hint?: string`
- `containerClassName?: string`
- props nativas de `input` (`value`, `onChange`, `placeholder`, etc.)

Ejemplo:

```tsx
<Input
  id="collection-name"
  label="Nombre"
  value={name}
  error={nameError}
  onChange={(e) => setName(e.target.value)}
/>
```

#### `Card`

Props clave:

- `title?: string`
- `description?: string`
- `actions?: ReactNode`
- `footer?: ReactNode`
- `variant?: 'default' | 'elevated' | 'bordered'`

Ejemplo:

```tsx
<Card title="Nueva coleccion" description="Crea una coleccion" variant="elevated">
  <CollectionForm onSubmit={handleCreateCollection} />
</Card>
```

#### `Alert`

Props clave:

- `variant?: 'info' | 'success' | 'warning' | 'danger'`
- `action?: ReactNode`
- `children: ReactNode`

Ejemplo:

```tsx
<Alert
  variant="danger"
  action={<Button variant="secondary" size="sm">Reintentar</Button>}
>
  No se pudo guardar la colección.
</Alert>
```

#### `EmptyState`

Props clave:

- `title?: string`
- `description?: string`
- `action?: ReactNode`
- `variant?: 'default' | 'subtle'`

Ejemplo:

```tsx
<EmptyState
  title="No hay colecciones"
  description="Crea la primera para empezar."
/>
```

#### `Badge`

Props clave:

- `label: string`
- `variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'`

Ejemplo:

```tsx
<Badge label="react" variant="info" />
```

#### `Spinner`

Props clave:

- `size?: 'sm' | 'md' | 'lg'`
- `label?: string`

Ejemplo:

```tsx
<Spinner size="sm" label="Procesando" />
```

#### `Modal`

Props clave:

- `open: boolean`
- `onClose: () => void`
- `title?: string`
- `description?: string`
- `footer?: ReactNode`
- `closeOnBackdrop?: boolean`

Ejemplo:

```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar accion"
>
  <p>¿Quieres continuar?</p>
</Modal>
```

### Features

#### `CollectionForm`

Props clave:

- `onSubmit: (data) => void`
- `mode?: 'create' | 'edit'`
- `initialValues?: { name: string; description?: string }`
- `onCancel?: () => void`

Ejemplo:

```tsx
<CollectionForm onSubmit={handleCreateCollection} />
<CollectionForm
  mode="edit"
  initialValues={{ name: selected.name, description: selected.description }}
  onSubmit={handleUpdateCollection}
  onCancel={handleCancelEdit}
/>
```

#### `CollectionList` / `CollectionItem`

Props clave:

- `collections: Collection[]`
- `onEditCollection: (id: string) => void`
- `onDeleteCollection: (id: string) => void`

Ejemplo:

```tsx
<CollectionList
  collections={collections}
  onEditCollection={handleEditCollection}
  onDeleteCollection={handleDeleteCollection}
/>
```

#### `FlashcardForm`

Props clave:

- `onSubmit: (data: CreateFlashcardInput) => void`

Ejemplo:

```tsx
<FlashcardForm onSubmit={handleCreateFlashcard} />
```

#### `FlashcardList` / `FlashcardItem`

Props clave:

- `flashcards: Flashcard[]`
- `onEditFlashcard: (id: string) => void`
- `onDeleteFlashcard: (id: string) => void`

Ejemplo:

```tsx
<FlashcardList
  flashcards={flashcards}
  onEditFlashcard={handleEditFlashcard}
  onDeleteFlashcard={handleDeleteFlashcard}
/>
```

#### `StudyControls`

Props clave:

- `onPrev`, `onNext`, `onReveal`, `onShuffle`
- `canPrev`, `canNext`
- `isRevealed`

Ejemplo:

```tsx
<StudyControls
  onPrev={handlePrev}
  onNext={handleNext}
  onReveal={handleReveal}
  onShuffle={handleShuffle}
  canPrev={currentIndex > 0}
  canNext={currentIndex < total - 1}
  isRevealed={isRevealed}
/>
```

#### `StudyCard`

Props clave:

- `flashcard: Flashcard`
- `isRevealed: boolean`

Ejemplo:

```tsx
<StudyCard flashcard={currentFlashcard} isRevealed={isRevealed} />
```

---

## Casos de reutilizacion

### Reutilizacion actual confirmada

- `Card`:
  - formularios (`CollectionForm`, `FlashcardForm`)
  - items/listados (`CollectionItem`, `FlashcardItem`)
  - bloques de pagina (`CollectionsPage`, `CollectionDetailPage`)
- `Button`:
  - acciones CRUD
  - navegacion secundaria
  - confirmacion/cancelacion en modales
- `Input`:
  - formularios de colecciones y flashcards
- `EmptyState`:
  - lista de colecciones vacia
  - lista de flashcards vacia
  - fallback por URL invalida
  - vista de estudio sin tarjetas
- `StudyCard`:
  - sesion de estudio en `StudyPage`
- `StudyControls`:
  - sesion de estudio en `StudyPage`

### Reutilizacion prevista en siguientes pasos

- `Modal` para confirmacion de borrado y edicion rapida.
- `Badge` para tags de flashcards y estados de estudio.
- `Spinner` para estados `loading` al conectar backend/API.

---

## Criterios para crear nuevos componentes

- Si un bloque se repite en 2 o mas pantallas, evaluar extraerlo.
- Si depende del dominio (colecciones/tarjetas), ubicarlo en `features`.
- Si no depende del dominio, ubicarlo en `ui`.
- Mantener props tipadas y nombres consistentes con `src/types`.
- Preferir componentes "controlados por props" para mantener UI desacoplada de la logica de pagina.
