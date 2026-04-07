# Routing de FlashLearn

Este documento describe el enrutado actual del frontend (React Router), la responsabilidad de cada ruta y el flujo de navegacion entre vistas.

---

## Router base

- Router principal: `BrowserRouter`
- Arbol de rutas definido en: `src/main.tsx`
- Layout compartido: `src/App.tsx` con `Outlet`

`App` contiene la navegacion global y renderiza la vista activa dentro de `Outlet`.

---

## Mapa de rutas (actual)

| Ruta                         | Renderiza               | Objetivo                                           |
| ---------------------------- | ----------------------- | -------------------------------------------------- |
| `/`                          | `HomePage`              | Pantalla de inicio y resumen general               |
| `/collections`               | `CollectionsPage`       | CRUD de colecciones                                |
| `/collections/:collectionId` | `CollectionDetailPage`  | Gestion de flashcards de una coleccion concreta    |
| `/study`                     | `StudyPage`             | Sesion de estudio (tarjeta activa + controles)     |
| `/about`                     | `AboutPage`             | Informacion de la app y alcance actual             |
| `/settings`                  | `SettingsPage`          | Ruta reservada para preferencias y ajustes         |
| `/home`                      | `Navigate` -> `/`       | Alias de compatibilidad hacia inicio               |
| `*`                          | `NotFoundPage`          | Fallback para cualquier URL no definida            |


---

## Qué renderiza cada ruta

- `/`: renderiza `HomePage` con resumen de colecciones y componente reutilizable de resumen de flashcards.
- `/collections`: renderiza `CollectionsPage` (listado, formulario, búsqueda y modal de borrado).
- `/collections/:collectionId`: renderiza `CollectionDetailPage` con filtro por URL y acciones de crear/borrar flashcards.
- `/study`: renderiza `StudyPage` con navegación de tarjetas, reveal y barajar.
- `/about`: renderiza `AboutPage` (contenido informativo).
- `/settings`: renderiza `SettingsPage` (stub de configuración para fases siguientes).
- `*`: renderiza `NotFoundPage` con mensaje claro y botón para volver al inicio.

---

## Navegación entre pantallas

## Desde layout global (`App`)

- `NavLink` a `Inicio` -> `/`
- `NavLink` a `Colecciones` -> `/collections`
- `NavLink` a `Estudio` -> `/study`
- `NavLink` a `Acerca` -> `/about`
- `NavLink` a `Ajustes` -> `/settings`

Los `NavLink` aplican estilo activo (`isActive`) para indicar la sección actual.

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

## Protección y validación (estado actual)

### Protección de rutas

- No hay autenticación ni rutas privadas en esta fase.
- Todas las rutas son públicas.

### Validaciones de navegación

- `CollectionDetailPage` valida ausencia de `collectionId` y muestra estado de error de navegación con acción de retorno.
- `NotFoundPage` cubre URLs inválidas con una salida clara (`Volver al inicio`).
- En `HomePage` y otras vistas se usa navegación declarativa (`NavLink`) y programática (`useNavigate`) según el flujo.

---

## Criterios de calidad del routing (MVP)

- Cada ruta tiene responsabilidad unica y clara.
- El layout principal no duplica logica de paginas.
- Las rutas dinamicas validan ausencia de parametro.
- Existe fallback visual (`NotFoundPage`) para errores de URL.

