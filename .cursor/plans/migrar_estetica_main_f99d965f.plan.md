---
name: Migrar estetica main
overview: Aplicar la estética visual de la rama main en la rama actual basada en Carbon, manteniendo la lógica funcional nueva. El plan prioriza tokens globales, wrappers UI y ajuste por páginas con validación visual por estado.
todos:
  - id: baseline-main-style
    content: Extraer y fijar checklist visual de main como referencia única.
    status: completed
  - id: global-tokens
    content: Centralizar tokens y utilidades globales en src/index.css para evitar estilos dispersos.
    status: completed
  - id: carbon-wrappers-parity
    content: Ajustar wrappers ui-carbon para paridad visual con componentes UI de main.
    status: completed
  - id: layout-nav-alignment
    content: Alinear AppShell y MainNav con jerarquía visual y spacing de main.
    status: completed
  - id: features-visual-polish
    content: Pulir estilos en components/features sin alterar lógica funcional.
    status: completed
  - id: pages-consistency
    content: Corregir consistencia visual por cada página principal y secundaria.
    status: completed
  - id: visual-qa
    content: Ejecutar QA de estados, accesibilidad visual y lint en archivos modificados.
    status: completed
isProject: false
---

# Plan exacto: estética de `main` en rama actual

## Objetivo
Replicar el look & feel de `main` (paleta, tipografía, jerarquía visual, spacing y estados) sobre la implementación actual con Carbon, sin revertir mejoras funcionales recientes.

## Fase 1: Congelar baseline visual de `main`

- Revisar y tomar como referencia visual:
  - [`src/index.css`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/index.css)
  - [`src/components/ui/Button.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui/Button.tsx) (en `main`, solo referencia de variantes)
  - [`src/components/ui/Card.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui/Card.tsx) (en `main`)
  - [`src/components/ui/Input.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui/Input.tsx) (en `main`)
  - [`src/components/ui/Modal.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui/Modal.tsx) (en `main`)
- Definir checklist visual no-negociable de `main`:
  - fondo general `slate-100`
  - jerarquía de títulos `indigo-900`
  - controles con bordes suaves indigo
  - estados hover/focus de alto contraste
  - modales con overlay suave + panel claro

## Fase 2: Centralizar tokens y utilidades globales

- Usar [`src/index.css`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/index.css) como fuente única de tokens visuales.
- Añadir/normalizar variables CSS para evitar hex repetidos:
  - `--fl-bg`, `--fl-text`, `--fl-primary`, `--fl-primary-hover`, `--fl-border`, `--fl-surface`, `--fl-radius`, `--fl-focus`
- Reescribir clases `.app-shell*`, `.page-*`, `.section-*` para que coincidan con proporciones de `main`.
- Mantener `@carbon/styles`, pero hacer que los overrides `.fl-*` usen tokens de arriba.

## Fase 3: Paridad visual en wrappers Carbon

Ajustar wrappers para que expongan exactamente la semántica de `main`:

- Botones: [`src/components/ui-carbon/ButtonCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/ButtonCarbon.tsx)
  - Alinear variantes `primary/secondary/danger/ghost` con mapeo visual de `main`.
  - Uniformar alturas `sm/md/lg` y radios.
- Inputs y filtros:
  - [`src/components/ui-carbon/InputCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/InputCarbon.tsx)
  - [`src/components/ui-carbon/SearchCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/SearchCarbon.tsx)
  - [`src/components/ui-carbon/SelectCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/SelectCarbon.tsx)
  - Igualar label, borde, fondo y focus ring al patrón de `main`.
- Contenedores:
  - [`src/components/ui-carbon/CardCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/CardCarbon.tsx)
  - [`src/components/ui-carbon/EmptyStateCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/EmptyStateCarbon.tsx)
  - Igualar variantes `default/elevated/bordered` y densidad visual.
- Modal:
  - [`src/components/ui-carbon/ModalCarbon.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui-carbon/ModalCarbon.tsx)
  - Replica de contraste overlay/panel/footer de `main` usando `.fl-modal-carbon`.

## Fase 4: Layout y navegación

- Ajustar shell para equivalencia visual con nav de `main`:
  - [`src/App.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/App.tsx)
  - [`src/components/layout/AppShell.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/layout/AppShell.tsx)
  - [`src/components/layout/MainNav.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/layout/MainNav.tsx)
- Mantener tema global en [`src/main.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/main.tsx), pero verificar que no sobreescriba color/typography objetivo.

## Fase 5: Pulido visual por features (sin tocar lógica)

Ajustar solo clases/props visuales en:

- Collections:
  - [`src/components/features/collections/CollectionForm.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/collections/CollectionForm.tsx)
  - [`src/components/features/collections/CollectionItem.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/collections/CollectionItem.tsx)
  - [`src/components/features/collections/CollectionList.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/collections/CollectionList.tsx)
  - [`src/components/features/collections/CollectionListSkeleton.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/collections/CollectionListSkeleton.tsx)
- Flashcards:
  - [`src/components/features/flashcards/FlashcardForm.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/flashcards/FlashcardForm.tsx)
  - [`src/components/features/flashcards/FlashcardItem.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/flashcards/FlashcardItem.tsx)
  - [`src/components/features/flashcards/FlashcardList.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/flashcards/FlashcardList.tsx)
  - [`src/components/features/flashcards/FlashcardsSummary.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/flashcards/FlashcardsSummary.tsx)
- Study:
  - [`src/components/features/study/StudyCard.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/study/StudyCard.tsx)
  - [`src/components/features/study/StudyControls.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/features/study/StudyControls.tsx)
- Componente semántico residual:
  - [`src/components/ui/Badge.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/components/ui/Badge.tsx)

## Fase 6: Ajuste visual por página

- Home: [`src/pages/HomePage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/HomePage.tsx)
- Collections: [`src/pages/CollectionsPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/CollectionsPage.tsx)
- Collection detail: [`src/pages/CollectionDetailPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/CollectionDetailPage.tsx)
- Study: [`src/pages/StudyPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/StudyPage.tsx)
- Complementarias: [`src/pages/AboutPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/AboutPage.tsx), [`src/pages/SettingsPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/SettingsPage.tsx), [`src/pages/NotFoundPage.tsx`](c:/Users/dnhos/OneDrive/Documentos/programación/Repositorios/FlashLearn/src/pages/NotFoundPage.tsx)

En cada página validar consistencia de:
- `page-title`, `page-subtitle`, `section-stack`, `card-grid-2`
- espaciados verticales
- tipografía de soporte (`text-muted`)
- estado visual de acciones primarias/secundarias

## Fase 7: QA visual y accesibilidad

- Revisar estados por pantalla:
  - `loading`, `error`, `empty`, `success`, `modal abierto/cerrado`
- Revisar interacción:
  - `hover`, `focus-visible`, `disabled`, `aria-live` visualmente no intrusivo
- Verificar que no haya regressions funcionales de lógica nueva (reintentos, confirmaciones, búsqueda, filtros).

## Criterios de aceptación

- La app conserva el flujo funcional actual.
- Botones/inputs/cards/modales tienen apariencia equivalente a `main`.
- Layout y navegación mantienen coherencia visual en todas las rutas.
- No hay inconsistencias de color/radio/spacing entre pantallas.
- Sin errores de linter en archivos tocados.

## Orden de ejecución recomendado

1. `src/index.css`
2. `src/components/ui-carbon/*`
3. `src/components/layout/*` + `src/App.tsx`
4. `src/components/features/*`
5. `src/pages/*`
6. QA visual final
