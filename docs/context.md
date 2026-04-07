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

---

## Casos de uso reales en tu app

### Resumen en Home

- `HomePage` consume `CollectionsContext` para mostrar el conteo y el estado de red.
- `HomePage` también muestra un resumen reutilizable de tarjetas con `FlashcardsSummary` (componente que consume `FlashcardsContext`).

### Gestión de colecciones

- `CollectionsPage` consume `CollectionsContext` para CRUD (crear, editar, borrar) sin duplicar lógica de almacenamiento.
- Componentes como `CollectionList` y `CollectionItem` son presentacionales (reciben datos/handlers por props) y pueden estar memoizados sin depender del contexto.

### Detalle de colección (flashcards)

- `CollectionDetailPage` consume `FlashcardsContext`:
  - Filtra `allFlashcards` por `collectionId` de la URL.
  - Crea flashcards con `createForCollection(collectionId, input)` para asociarlas a la colección correcta.

### Estudio global

- `StudyPage` consume `FlashcardsContext` para obtener el mazo completo y mantener la sesión (índice, reveal, barajar) como estado local.
- La misma página puede mostrar un resumen (`FlashcardsSummary`) sin recalcular manualmente estadísticas en cada página.

---

## Ventajas y límites

### Ventajas

- **Una sola fuente en memoria por dominio**: evita “dos copias” del estado cuando varias rutas necesitan ver lo mismo.
- **Reactividad automática**: cuando cambian `collections` o `allFlashcards`, se re-renderizan consumidores (páginas y componentes) sin wiring manual.
- **API estable**: el contexto expone el mismo contrato que el hook (`network`, `refresh`, acciones), lo que facilita migrar de `localStorage` a API HTTP sin reescribir toda la UI.
- **Mejor rendimiento en UI**: con handlers estables (`useCallback`) y listas memoizadas, los hijos presentacionales evitan renders innecesarios.

### Límites / trade-offs (estado actual)

- **No hay normalización/caché avanzada**: el store de flashcards es un array “plano”. Si creciera mucho, quizá haría falta paginación, índices o cache por colección.
- **Persistencia actual es local**: hoy el origen es `localStorage`; el contexto no resuelve sincronización multi-dispositivo (eso llega al conectar backend).
- **Actualizaciones cruzadas**: si borras una colección, las flashcards asociadas no se borran automáticamente a menos que lo implementes como regla de negocio (backend o acción coordinada).
- **No sustituye a un store especializado**: si el dominio crece (optimistic updates, invalidaciones, caching), quizá convenga una capa de datos (cliente API + cache) manteniendo el contexto como “surface”.

---

## Ejemplo de flujo de datos (end-to-end)

### Crear una flashcard y ver reactividad en varias vistas

1. **Usuario** entra a `CollectionDetailPage` (`/collections/:collectionId`).
2. `CollectionDetailPage` llama `useFlashcardsContext()` y obtiene `allFlashcards`, `createForCollection`, `network`.
3. El usuario envía el formulario `FlashcardForm`.
4. `handleCreateFlashcard` ejecuta `createForCollection(collectionId, input)`.
5. `useFlashcards` (dentro del `FlashcardsProvider`) hace `setAllFlashcards((prev) => [newFlashcard, ...prev])`.
6. **React re-renderiza** todos los consumidores del contexto:
   - `CollectionDetailPage` recalcula su lista filtrada (por `collectionId`) y muestra la nueva tarjeta.
   - `HomePage` (si está montado o al volver) actualiza `FlashcardsSummary` mostrando el nuevo total.
   - `StudyPage` (al volver) verá el mazo actualizado; además, el listener de `focus` llama a `refresh()` para revalidar desde almacenamiento.
7. El `useEffect` de persistencia en `useFlashcards` detecta `network.status === 'success'` y guarda el array actualizado en `localStorage` con `saveFlashcards(allFlashcards)`.
