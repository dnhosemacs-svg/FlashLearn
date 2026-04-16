# Carbon Component Mapping (Fase 10)

## Objetivo

Definir equivalencias entre la UI actual y componentes IBM Carbon para una migración incremental **sin romper coherencia visual** (tema claro `g10`, densidad media) y sin introducir regresiones funcionales.

## Principios de migración (criterios del proyecto)

- Mantener comportamiento funcional actual (CRUD, navegación, loading/error).
- No tocar lógica de dominio (`src/hooks/*`, `src/context/*`, `src/api/*`) durante Fase 10.
- Migrar por capas: primero componentes base (botón/input/card/feedback), luego pantallas.
- Minimizar cambios masivos usando wrappers temporales.

---

## Mapeo actual -> Carbon

| Actual (archivo) | Carbon destino | Wrapper temporal | Notas |
|---|---|---|---|
| `src/components/ui/Button.tsx` | `Button` (`@carbon/react`) | `src/components/ui-carbon/ButtonCarbon.tsx` | Adaptar variantes (`primary/secondary/danger/ghost`) a `kind`. Mantener `isLoading`, `leftIcon`, `rightIcon` mediante wrapper. |
| `src/components/ui/Input.tsx` | `TextInput` (`@carbon/react`) | `src/components/ui-carbon/InputCarbon.tsx` | Mantener API `label/error/hint`. Usar invalid state de Carbon. |
| Inputs search en páginas | `Search` (`@carbon/react`) | `src/components/ui-carbon/SearchCarbon.tsx` | Sustituir `input type="search"` gradualmente por `Search`. |
| `src/components/ui/Modal.tsx` | `Modal` o `ComposedModal` (`@carbon/react`) | `src/components/ui-carbon/ModalCarbon.tsx` | Migrar preservando `open`, `title`, `description`, `footer`. |
| `src/components/ui/Spinner.tsx` | `InlineLoading` / `Loading` (`@carbon/react`) | `src/components/ui-carbon/SpinnerCarbon.tsx` | `InlineLoading` para inline; `Loading` para overlay si se necesita. |
| `src/components/ui/Skeleton.tsx` + list skeletons | `SkeletonText` / `SkeletonPlaceholder` (`@carbon/react`) | `src/components/ui-carbon/SkeletonCarbon.tsx` | Mantener slots de tamaño con `className` en wrapper si hace falta. |
| `src/components/ui/Card.tsx` | `Tile` (+ `Layer` si aplica) (`@carbon/react`) | `src/components/ui-carbon/CardCarbon.tsx` | Usar `Tile` como superficie. `Layer` en anidados. |
| `src/components/ui/EmptyState.tsx` | `InlineNotification` + CTA (`Button`) | `src/components/ui-carbon/EmptyStateCarbon.tsx` | Patrón recomendado para vacío/error con acción reintento. |

---

## Patrón de contenedores (Tile / Layer / Grid)

### Decisión para Fase 10

- Conservar estructura de layout actual (`page-shell`, `card-grid-2`) para evitar regresiones.
- Migrar primero la “piel” de componentes; refactor de layout profundo (Grid Carbon) queda para fase siguiente si compensa.

### Reglas

- Superficies principales: `Tile`.
- Secciones anidadas: `Layer` para jerarquía.
- Evitar fondos y bordes hardcodeados en componentes migrados; preferir estilos Carbon.

---

## Patrón para EmptyState con Carbon

### Composición recomendada

- `InlineNotification` para mensaje.
- CTA con `Button` (reintento / acción principal).
- Mantener API del wrapper: `title`, `description`, `action`, `icon` (si aplica).

---

## Wrappers temporales (se mantienen durante Fase 10)

Carpeta propuesta:

- `src/components/ui-carbon/`

Wrappers:

- `ButtonCarbon.tsx`
- `InputCarbon.tsx`
- `SearchCarbon.tsx`
- `ModalCarbon.tsx`
- `SpinnerCarbon.tsx`
- `SkeletonCarbon.tsx`
- `CardCarbon.tsx`
- `EmptyStateCarbon.tsx`

### Política

- Las nuevas migraciones usan wrappers Carbon.
- `src/components/ui/*` permanece hasta completar migración de pantallas principales.
- La retirada del legacy se planifica al cierre de Fase 10 (o inicio de Fase 11).

---

## Orden recomendado de implementación

1. `ButtonCarbon`
2. `InputCarbon` + `SearchCarbon`
3. `CardCarbon`
4. `ModalCarbon`
5. `SpinnerCarbon` + `SkeletonCarbon`
6. `EmptyStateCarbon`
7. Migración por pantalla (Home → Collections → CollectionDetail → Study)

---

## Criterios para eliminar wrappers (fase futura)

Se podrán retirar los wrappers de `src/components/ui-carbon/*` cuando se cumplan todas estas condiciones:

- Todas las pantallas principales (`Home`, `Collections`, `CollectionDetail`, `Study`) usen Carbon de forma estable.
- No queden imports activos de componentes legacy en flujo principal (`src/components/ui/*`).
- La API de props esté alineada a Carbon (sin depender de adaptaciones legacy críticas).
- `npm run lint` y `npm run build` pasen tras eliminar wrappers.
- Se complete una revisión visual y de accesibilidad sin regresiones.

Hasta entonces, los wrappers siguen siendo la capa oficial de transición para minimizar riesgo y refactor masivo.
