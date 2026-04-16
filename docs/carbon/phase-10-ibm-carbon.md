# FASE 10: Implementación de IBM Carbon

## 1) Alcance visual de la fase

### Pantallas incluidas
- Home (`src/pages/HomePage.tsx`)
- Collections (`src/pages/CollectionsPage.tsx`)
- Collection Detail (`src/pages/CollectionDetailPage.tsx`)
- Study (`src/pages/StudyPage.tsx`)

### Componentes a migrar primero (prioridad)
1. Botones
2. Inputs (text/search/select/textarea)
3. Card/contenedores visuales
4. Modal
5. Listas/tablas y estados vacíos
6. Feedback visual (Skeleton/Spinner/Inline messages)

### Fuera de alcance en esta fase
- Cambios de lógica en hooks.
- Cambios de lógica en context.
- Cambios en contratos API o capa de red.
- Refactors funcionales de navegación/rutas.

## 2) Criterio de "fase terminada"

La fase se considera terminada cuando:
- Las 4 pantallas principales usan componentes Carbon en UI principal.
- No quedan componentes visuales legacy en flujo principal (botón/input/card/modal/lista).
- `npm run lint` y `npm run build` pasan.
- No hay regresiones funcionales en CRUD y Study.
- Se mantiene comportamiento de loading/success/error.

## 3) Regla de seguridad técnica

Durante FASE 10:
- No modificar archivos de lógica de dominio: `src/hooks/*`, `src/context/*`, `src/api/*`.
- Solo cambios en capa visual (`src/components/*`, `src/pages/*`, estilos y wrappers de UI).
- Si un cambio visual requiere tocar lógica, se documenta como "pendiente fase siguiente".

## 4) Inventario UI actual por pantalla

| Pantalla | Componentes visuales clave | Prioridad |
|---|---|---|
| Home | Button, Card/Summary, Spinner | Alta |
| Collections | Button, Input(search), Form, Modal, List, Skeleton | Muy alta |
| Collection Detail | Button, Input(search), Form, List, Skeleton, EmptyState | Muy alta |
| Study | Button, Select, Card, Controls, Spinner/EmptyState | Alta |

## 5) Checklist operativo (Trello-ready)

- [ ] Inventario de pantallas confirmado
- [ ] Matriz de componentes priorizada
- [ ] Criterio de done acordado
- [ ] Regla de no tocar hooks/context documentada
- [ ] Aprobación para pasar a instalación y setup de Carbon

## Setup técnico realizado

- Ver detalle en `docs/carbon/carbon-setup.md`

## Mapeo de componentes a Carbon

- Ver detalle en `docs/carbon/carbon-component-mapping.md`

## Checklist de transición de wrappers

- [ ] Definir wrappers Carbon en `src/components/ui-carbon/`
- [ ] Mantener `src/components/ui/*` mientras dure la migración
- [ ] Evitar imports mixtos arbitrarios en una misma pantalla
- [ ] Plan de retirada legacy al cierre de fase

## Decisiones de theming de Fase 10

- Tema inicial: `g10` para mantener estética clara y cercana al look actual de la app.
- Tipografía base: IBM Plex (provista por Carbon) para consistencia visual y buena legibilidad.
- Densidad visual objetivo: media, priorizando lectura cómoda en desktop y laptop.
- Colores semánticos: usar estados nativos de Carbon para `success`, `error`, `warning`, `info`.
- Toggle de tema (`white` / `g10` / `g90`) fuera de alcance en Fase 10; se evaluará en la siguiente fase.

## Validación de layout

- Checklist visual y responsive: `docs/carbon/layout-checklist.md`

## Pendientes para fase siguiente

- [ ] Registrar aquí cualquier necesidad de cambio lógico detectada durante migración visual.
