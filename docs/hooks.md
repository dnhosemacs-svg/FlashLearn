# Hooks de dominio (FlashLearn)

Este documento describe los hooks personalizados en `src/hooks/`: **qué hace cada uno**, **cuándo usarlo** y **ejemplos prácticos** alineados con el código actual del proyecto.

Para el contexto de arquitectura (capas, limitaciones MVP, `StudyPage`), ver tambien `docs/design.md` (secciones *Hooks de dominio* y *Verificacion Fase 4*).

---

## Tipos compartidos

### `AsyncState` (`src/types/async.ts`)

Todos los hooks de datos exponen `network: AsyncState`:

| Campo | Tipo | Significado |
|-------|------|-------------|
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Fase de la operacion de carga |
| `error` | `string \| null` | Mensaje humano si `status === 'error'` |

Patron de UI recomendado:

- `loading` y lista vacia → indicador de carga (`Spinner`).
- `error` → mensaje + boton que llame a `refresh()`.
- `success` → render normal con datos.

---

## `useCollections`

**Archivo:** `src/hooks/useCollections.ts`  
**Import:** `import { useCollections } from '../hooks'`

### Que hace

1. Al montar el componente, **carga** las colecciones desde `localStorage` (via `loadStoredCollections`).
2. Expone el array **`collections`** y el estado de red **`network`**.
3. Cuando `network.status === 'success'`, **persiste** automaticamente los cambios con `saveCollections` (evita guardar antes de haber cargado bien).
4. Ofrece acciones **imperativas**:
   - **`create(input)`** — nueva coleccion (`CreateCollectionInput`).
   - **`update(id, input)`** — actualiza nombre y descripcion (`UpdateCollectionInput`).
   - **`remove(id)`** — elimina por id.
5. **`refresh()`** — vuelve a leer del almacenamiento (reintentos, sincronizar tras otra pestaña, etc.).

No gestiona: busqueda, modales, ni “modo edicion” de la UI; eso sigue en la pagina.

### Cuando usarlo

- En cualquier pantalla o contenedor que necesite la **lista de colecciones** y operaciones CRUD sobre ellas sin duplicar logica de `localStorage`.
- Hoy lo usa **`CollectionsPage`**.

### API resumida

```ts
interface UseCollectionsResult {
  collections: Collection[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateCollectionInput) => void
  update: (id: string, input: UpdateCollectionInput) => void
  remove: (id: string) => void
}
```

### Ejemplo practico (pagina)

```tsx
import { useCollections } from '../hooks'
import type { UpdateCollectionInput } from '../types/domain'

export default function CollectionsPage() {
  const { collections, network, refresh, create, update, remove } = useCollections()
  const [editingId, setEditingId] = useState<string | null>(null)

  if (network.status === 'error') {
    return <button type="button" onClick={() => void refresh()}>Reintentar</button>
  }

  const handleSaveEdit = (data: UpdateCollectionInput) => {
    if (!editingId) return
    update(editingId, data)
    setEditingId(null)
  }

  return (
    <>
      <CollectionForm onSubmit={create} />
      <CollectionList
        collections={collections}
        onDeleteCollection={(id) => remove(id)}
      />
    </>
  )
}
```

---

## `useFlashcards`

**Archivo:** `src/hooks/useFlashcards.ts`  
**Import:** `import { useFlashcards } from '../hooks'`

### Que hace

1. Carga **todas** las flashcards del almacenamiento (`loadStoredFlashcards`) en estado interno **`allFlashcards`**.
2. Expone **`flashcards`**:
   - Si llamas al hook **con** `collectionId`, `flashcards` son solo las de esa coleccion.
   - Si llamas **sin** argumento, `flashcards` es el mismo conjunto que `allFlashcards` (todas las tarjetas).
3. Persiste en disco cuando `network.status === 'success'`, igual que colecciones.
4. **`create(input)`** solo tiene efecto si hay **`collectionId`** en el hook; en ese caso crea la tarjeta con ese `collectionId`.
5. **`remove(id)`** borra del store global (todas las colecciones).
6. **`refresh()`** — recarga desde almacenamiento.

### Cuando usarlo

| Situacion | Como llamarlo |
|-----------|----------------|
| Detalle de una coleccion: listar y crear tarjetas de **esa** coleccion | `useFlashcards(collectionId)` con el id de la URL o de la coleccion activa |
| Modo estudio con **todas** las tarjetas | `useFlashcards()` sin argumentos |
| Necesitas el listado completo aunque filtres en UI | Usa `allFlashcards` del resultado |

Hoy lo usan **`CollectionDetailPage`** (con id) y **`StudyPage`** (sin id).

### API resumida

```ts
interface UseFlashcardsResult {
  flashcards: Flashcard[]
  allFlashcards: Flashcard[]
  network: AsyncState
  refresh: () => Promise<void>
  create: (input: CreateFlashcardInput) => void
  remove: (id: string) => void
}
```

### Ejemplo practico — detalle de coleccion

```tsx
import { useParams } from 'react-router-dom'
import { useFlashcards } from '../hooks'

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const { flashcards, network, refresh, create, remove } = useFlashcards(collectionId)

  if (network.status === 'loading' && flashcards.length === 0) {
    return <Spinner label="Cargando tarjetas" />
  }

  return (
    <>
      <FlashcardForm onSubmit={create} />
      <FlashcardList
        flashcards={flashcards}
        onDeleteFlashcard={remove}
      />
    </>
  )
}
```

### Ejemplo practico — estudio global

```tsx
import { useFlashcards } from '../hooks'

export default function StudyPage() {
  const { flashcards, network, refresh } = useFlashcards()

  useEffect(() => {
    const onFocus = () => void refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  // flashcards incluye todas las colecciones; el orden de "barajar" puede ser estado local de la pagina
}
```

---

## Notas importantes (MVP actual)

1. **Varias instancias del mismo hook**: cada componente que llama `useCollections()` o `useFlashcards()` tiene **su propio estado en React**. El disco se mantiene coherente al persistir, pero la memoria de otra pantalla no se actualiza sola hasta un **`refresh()`** (por eso `StudyPage` refresca al foco de ventana).
2. **Sustitucion por API**: la intencion es reemplazar las llamadas dentro de los hooks (`load*` / `save*`) por un cliente HTTP tipado (`src/api/client.ts` o similar), manteniendo la misma forma del retorno (`collections`, `network`, `refresh`, acciones).
3. **Barajar en estudio**: el orden aleatorio de repaso puede vivir en **estado local de la pagina**; no hace falta persistirlo en el hook ni en `localStorage` si no es un requisito de producto.

---

## Importacion centralizada

Desde paginas o features:

```ts
import { useCollections, useFlashcards } from '../hooks'
```

Los tipos `UseCollectionsResult` y `UseFlashcardsResult` se reexportan desde `src/hooks/index.ts` si necesitas anotar props o tests.
