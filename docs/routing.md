# Routing de FlashLearn

Este documento describe el enrutado actual del frontend (React Router), la responsabilidad de cada ruta y el flujo de navegacion entre vistas.

---

## Router base

- Router principal: `BrowserRouter`
- Arbol de rutas definido en: `src/main.tsx`
- Layout compartido: `src/App.tsx` con `Outlet`

`App` contiene la navegacion global y renderiza la vista activa dentro de `Outlet`.

---

## Tabla de rutas


| Ruta                         | Componente             | Objetivo                                        |
| ---------------------------- | ---------------------- | ----------------------------------------------- |
| `/`                          | `HomePage`             | Pantalla de inicio del micro-app                |
| `/collections`               | `CollectionsPage`      | CRUD de colecciones                             |
| `/collections/:collectionId` | `CollectionDetailPage` | Gestion de flashcards de una coleccion concreta |
| `/study`                     | `StudyPage`            | Sesion de estudio (tarjeta activa + controles)  |
| `/home`                      | `Navigate` -> `/`      | Alias de compatibilidad hacia inicio            |
| `*`                          | `NotFoundPage`         | Fallback para rutas inexistentes                |


---

## Navegacion entre pantallas

## Desde layout global (`App`)

- Link a `Inicio` -> `/`
- Link a `Colecciones` -> `/collections`
- Link a `Estudio` -> `/study`

## Desde `CollectionsPage`

- Cada `CollectionItem` tiene accion `Abrir` que navega a:
  - `/collections/:collectionId`

## Desde `CollectionDetailPage`

- Boton `Volver` navega a:
  - `/collections`

## Redirecciones y fallback

- `/home` redirige con `Navigate` a `/`
- Cualquier ruta no definida cae en `NotFoundPage`

---

## Parametros de ruta

- Parametro dinamico:
  - `collectionId` en `/collections/:collectionId`
- Lectura del parametro:
  - `useParams<{ collectionId: string }>()` en `CollectionDetailPage`

Si no hay `collectionId` valido, la pagina muestra `EmptyState` con accion para volver.

---

## Criterios de calidad del routing (MVP)

- Cada ruta tiene responsabilidad unica y clara.
- El layout principal no duplica logica de paginas.
- Las rutas dinamicas validan ausencia de parametro.
- Existe fallback visual (`NotFoundPage`) para errores de URL.

