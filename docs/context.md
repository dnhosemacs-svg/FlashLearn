# Context API (FlashLearn)

Este documento describe los contextos globales del frontend: **qué proveen**, **dónde se montan** y **cómo consumirlos**.

Relacionado: `docs/hooks.md` (los providers llaman a los hooks de dominio una sola vez), `docs/design.md`.

---

## Orden de providers

En `src/main.tsx`, dentro de `BrowserRouter`:

```txt
CollectionsProvider
  └── FlashcardsProvider
        └── Routes
```

No hay dependencia estricta entre ambos; el orden puede invertirse. Se mantiene asi por legibilidad (colecciones “encima” de tarjetas en el modelo mental).

---

## `CollectionsContext`

| Archivo | `src/context/CollectionsContext.tsx` |
|---------|--------------------------------------|
| Provider | `CollectionsProvider` |
| Consumidor | `useCollectionsContext()` |

### Qué hace

- Ejecuta **`useCollections()`** una vez y comparte el resultado con todo el arbol bajo el provider.
- Expone: `collections`, `network`, `refresh`, `create`, `update`, `remove`.

### Dónde se usa

- `CollectionsPage` — CRUD y listado.
- `HomePage` — resumen (conteo de colecciones, estado de red).

### Regla

No uses `useCollections()` directamente en paginas que deban ver el **mismo** estado que el resto; usa `useCollectionsContext()`.

---

## `FlashcardsContext`

| Archivo | `src/context/FlashcardsContext.tsx` |
|---------|-------------------------------------|
| Provider | `FlashcardsProvider` |
| Consumidor | `useFlashcardsContext()` |

### Qué hace

- Ejecuta **`useFlashcards()`** **sin** `collectionId` (store global de todas las tarjetas).
- Expone el mismo contrato que el hook: `flashcards` y `allFlashcards` (en este modo coinciden), `network`, `refresh`, `remove`, `create` (no-op sin id fijo), **`createForCollection(collectionId, input)`** para crear en una coleccion concreta desde el detalle.

### Dónde se usa

- `CollectionDetailPage` — filtra `allFlashcards` por `collectionId` de la URL; crea con `createForCollection(collectionId, data)`.
- `StudyPage` — usa `flashcards` como mazo completo para estudiar.

### Regla

En detalle **no** llames `useFlashcards(collectionId)` en paralelo al provider: usarias otra copia de estado. Siempre **`useFlashcardsContext()`** + `useMemo` para filtrar por coleccion.

---

## Errores habituales

- **`useCollectionsContext` / `useFlashcardsContext` fuera del provider** → error en tiempo de ejecucion con mensaje explícito.
- **Mezclar hook suelto y contexto** en la misma feature → dos fuentes de verdad en memoria y datos desincronizados hasta `refresh` o recarga.

---

## Evolución prevista

Al conectar la API, la logica dentro de `useCollections` / `useFlashcards` puede pasar a `fetch`; los contextos y la forma del valor expuesto pueden mantenerse para no reescribir todas las paginas de golpe.
