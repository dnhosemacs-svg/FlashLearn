# Arquitectura de FlashLearn

## Objetivo de esta fase

Definir una arquitectura simple, escalable y tipada para frontend y backend, empezando por los componentes principales de la UI.

---

## Mapa de componentes (frontend)

### Layout y navegación

- `AppShell`: layout principal de la app (header, navegación y contenedor de contenido).
- `MainNav`: barra de navegación con enlaces (`Inicio`, `Colecciones`, `Estudio`).
- `PageContainer`: wrapper común para márgenes, ancho máximo y espaciado vertical.

### UI base reutilizable

- `Button`: botón base con variantes (`primary`, `secondary`, `danger`, `ghost`).
- `Input`: campo de texto tipado para formularios.
- `Textarea`: campo largo para respuestas de tarjetas.
- `Select`: selector para colecciones y filtros.
- `Card`: contenedor visual reutilizable.
- `Modal`: diálogo para crear/editar elementos sin salir de la página.
- `EmptyState`: estado vacío para listas sin datos.
- `ConfirmDialog`: confirmación de acciones destructivas.

### Componentes de dominio (FlashLearn)

- `CollectionList`: lista de colecciones.
- `CollectionItem`: tarjeta/resumen de una colección.
- `CollectionForm`: formulario para crear/editar colección.
- `FlashcardList`: lista de tarjetas de una colección.
- `FlashcardItem`: vista resumida de tarjeta con acciones.
- `FlashcardForm`: formulario pregunta/respuesta.
- `StudyCard`: tarjeta en modo estudio (mostrar pregunta y revelar respuesta).
- `StudyControls`: acciones de estudio (anterior, siguiente, revelar, barajar).
- `ProgressIndicator`: progreso de sesión (`actual/total`).

### Páginas

- `HomePage`: portada y acceso rápido a flujos principales.
- `CollectionsPage`: CRUD de colecciones y navegación al detalle.
- `CollectionDetailPage`: CRUD de tarjetas dentro de una colección.
- `StudyPage`: modo repaso con navegación entre tarjetas.
- `NotFoundPage`: ruta 404.

---

## Composición por página

- `HomePage` -> `PageContainer` + accesos rápidos.
- `CollectionsPage` -> `PageContainer` + `CollectionList` + `CollectionForm` + `ConfirmDialog`.
- `CollectionDetailPage` -> `PageContainer` + `FlashcardList` + `FlashcardForm` + `ConfirmDialog`.
- `StudyPage` -> `PageContainer` + `StudyCard` + `StudyControls` + `ProgressIndicator`.

---

## Reglas de diseño de componentes

- Componentes de `src/components/ui` no conocen lógica de negocio.
- Componentes de `src/components/features` sí conocen el dominio (colecciones/tarjetas).
- Todo componente recibe `props` tipadas con interfaces de `src/types`.
- Mantener componentes pequeños: una responsabilidad principal por componente.
- Acciones de red y transformación de datos fuera de componentes (hooks/context/api client).

---

## Estructura sugerida de carpetas

```txt
src/
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
    features/
      collections/
        CollectionList.tsx
        CollectionItem.tsx
        CollectionForm.tsx
      flashcards/
        FlashcardList.tsx
        FlashcardItem.tsx
        FlashcardForm.tsx
      study/
        StudyCard.tsx
        StudyControls.tsx
        ProgressIndicator.tsx
  pages/
    HomePage.tsx
    CollectionsPage.tsx
    CollectionDetailPage.tsx
    StudyPage.tsx
    NotFoundPage.tsx
  types/
    domain.ts
    api.ts
```

---

## Tipos de dominio base (referencia)

- `Collection`: `id`, `name`, `description`, `createdAt`, `updatedAt`.
- `Flashcard`: `id`, `collectionId`, `question`, `answer`, `tags[]`, `createdAt`, `updatedAt`.
- `StudySession`: `collectionId`, `order[]`, `currentIndex`, `revealed`.

---

## Estrategia de estado

La estrategia separa claramente tres capas: estado local de UI, estado global compartido y estado remoto (red/API).

### 1) Estado local (componente/pagina)

Usar `useState` para estado efimero y visual que no necesita compartirse globalmente:

- apertura/cierre de modales
- valor de inputs en formularios
- tabs seleccionadas
- orden local de una tabla/lista
- flags temporales como `isSubmitting` en un formulario puntual

Regla: si solo lo usa un componente o una pagina, queda local.

### 2) Estado global (Context API)

Usar `Context` para datos transversales que consumen varias paginas o componentes:

- `StudySessionContext`: sesion de estudio actual (coleccion activa, indice, revelar respuesta, barajar)
- `UIContext`: preferencias de interfaz (tema, densidad, filtros persistentes de vista)

Regla: si 3+ ramas de componentes necesitan el mismo dato y hay prop drilling, pasar a contexto.

### 3) Estado de red (server state)

La fuente de verdad para datos de negocio es el backend (`/api/v1`):

- colecciones
- tarjetas
- resultados de operaciones CRUD

Gestion en frontend:

- `loading`: solicitud en curso
- `error`: error recuperable de red o validacion
- `success/data`: datos confirmados por backend

Patron recomendado:

- `src/api/client.ts` para llamadas HTTP tipadas
- hooks de dominio en `src/hooks` (por ejemplo `useCollections`, `useFlashcards`)
- la UI nunca llama `fetch` directamente

### 4) Persistencia local (uso acotado)

`localStorage` queda solo para estado de experiencia de usuario, no para negocio:

- ultima coleccion abierta
- preferencia de orden de estudio
- flags UI (ejemplo: tutorial visto)

No guardar como fuente principal:

- lista completa de colecciones
- tarjetas canónicas

### 5) Flujo de actualizacion recomendado

1. Usuario ejecuta accion en UI (crear, editar, borrar).
2. Hook de dominio llama a `api/client.ts`.
3. Backend responde con entidad actualizada o error.
4. El estado de red se actualiza y la UI se re-renderiza.
5. Si aplica, se sincroniza una preferencia de UI en `localStorage`.

### 6) Criterios para decidir tipo de estado

- Si afecta solo al render de un componente -> estado local.
- Si coordina varias pantallas/componente -> contexto.
- Si representa negocio persistente -> backend/API.
- Si es preferencia del usuario y no rompe consistencia de negocio -> `localStorage`.

---

## Persistencia cliente/servidor

### Fuente de verdad

- **Servidor (backend API)**: fuente de verdad unica para datos de negocio (`collections`, `flashcards`).
- **Cliente (frontend)**: estado transitorio de presentacion y experiencia de usuario.

### Responsabilidades por capa

- Backend:
  - persistir entidades de dominio
  - validar entrada y reglas de negocio
  - devolver respuestas estandarizadas
- Frontend:
  - renderizar estado de red (`loading`, `error`, `data`)
  - manejar interacciones de UI (formularios, modales, filtros)
  - no guardar entidades canonicas como origen principal

### Uso permitido de localStorage

`localStorage` se permite solo para preferencias de UI:

- ultima coleccion abierta
- configuracion de estudio (por ejemplo barajar)
- flags de experiencia (por ejemplo onboarding visto)

No usar `localStorage` como fuente principal de:

- colecciones
- flashcards

### Estrategia de transicion (estado actual del proyecto)

- En desarrollo temprano se pueden usar mocks en memoria para avanzar la UI.
- Al conectar `src/api/client.ts`, se migra progresivamente cada feature a datos remotos.
- La definicion final se mantiene: negocio en servidor, estado de UI en cliente.

---

## Reglas de sincronizacion

### Flujo obligatorio de escritura (create/update/delete)

1. La UI dispara una accion de usuario (submit, editar, borrar).
2. El frontend llama al backend mediante `src/api/client.ts`.
3. Solo si el backend confirma exito, se actualiza el estado mostrado en pantalla.
4. Si falla, no se consolida el cambio y se muestra feedback de error.

Regla clave: **no confirmar cambios de negocio de forma definitiva en cliente sin confirmacion del servidor**.

### Flujo de lectura

1. Al entrar a una vista, el frontend solicita datos al backend.
2. Mientras llega la respuesta, mostrar estado `loading`.
3. Si hay error, mostrar estado `error` recuperable.
4. Si hay datos, renderizar `data` recibida como fuente actual.

### Revalidacion y consistencia

- Despues de operaciones mutantes (`POST`, `PATCH`, `DELETE`), refrescar la vista afectada o actualizar cache local con la respuesta del servidor.
- Evitar que dos fuentes compitan por el mismo dato (por ejemplo API y localStorage para colecciones).
- Si hay discrepancia entre cliente y servidor, prevalece el servidor.

### Reglas de IDs y timestamps

- `id`, `createdAt` y `updatedAt` los determina el servidor.
- El cliente no inventa IDs canonicos para persistencia final.

---

## Que vive en cliente y que vive en servidor

| Tipo de dato | Vive en cliente | Vive en servidor |
|---|---|---|
| Colecciones (`collections`) | no (solo copia temporal para render) | si (fuente de verdad) |
| Tarjetas (`flashcards`) | no (solo copia temporal para render) | si (fuente de verdad) |
| Resultado CRUD de negocio | no permanente | si |
| Estado de formulario en curso | si | no |
| Modal abierto/cerrado | si | no |
| Filtros/sort de visualizacion | si | no (salvo que se quiera persistir preferencia) |
| Preferencias de UX (tema, onboarding, ultima vista) | si (`localStorage`) | no |
| Errores de validacion de dominio | se muestran en UI | se originan y validan en servidor |

Regla de oro: **negocio en servidor, experiencia en cliente**.

---

## Decisiones tomadas en esta fase

- La UI se divide entre componentes base (`ui`) y componentes de dominio (`features`).
- Las páginas solo orquestan componentes; no concentran toda la lógica.
- Se prepara la app para migrar de LocalStorage a API sin rehacer la interfaz.
