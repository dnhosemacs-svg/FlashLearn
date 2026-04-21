# QA Checklist - Fase 10 Carbon

## Estado general
- [x] Lint OK
- [x] Build OK
- [ ] Funcional por pantalla OK
- [ ] Cross-browser básico OK
- [ ] Accesibilidad básica OK
- [ ] Loading/Error states OK

---

## 1) Funcional por pantalla

### Home (`/`)
- [ ] Carga sin errores visuales
- [ ] Botón "Ir a colecciones" navega correctamente
- [ ] Botón "Modo estudio" navega correctamente
- [x] Estado loading visible cuando aplica (validación estática en código)
- [x] Estado error + reintento visible cuando aplica (validación estática en código)

### Collections (`/collections`)
- [ ] Crear colección funciona
- [ ] Editar colección funciona
- [ ] Borrar colección funciona (confirmación modal)
- [ ] Buscar colección funciona
- [x] Retry funciona tras error (validación estática en código)
- [ ] Sin regresión visual en lista/cards/formulario

### Collection Detail (`/collections/:collectionRef`)
- [ ] Crear flashcard funciona
- [ ] Editar flashcard funciona
- [ ] Borrar flashcard funciona (confirmación modal)
- [ ] Buscar flashcards funciona
- [x] Retry funciona tras error (validación estática en código)
- [ ] Botón volver funciona

### Study (`/study`)
- [ ] Selector de colección filtra correctamente
- [ ] Navegación anterior/siguiente funciona
- [ ] Revelar/ocultar funciona
- [ ] Barajar funciona
- [x] Estado vacío correcto (validación estática en código)
- [x] Estado error + retry correcto (validación estática en código)

---

## 2) Cross-browser básico
Navegadores probados:
- [x] Edge
- [x] Firefox

Resultado por navegador:
- Chrome: [OK / Issues]
- Edge: [OK / Issues]
- Firefox: [OK / Issues]

---

## 3) Accesibilidad básica

### Teclado
- [ ] Navegación por Tab/Shift+Tab en header
- [ ] Botones accionables con Enter/Espacio
- [ ] Modal abre/cierra con teclado
- [x] Escape cierra modal (validación estática en código)
- [ ] Foco vuelve a elemento razonable al cerrar modal

### Foco y contraste
- [ ] Focus ring visible en botones/inputs/links
- [ ] Contraste legible en texto principal y mensajes de estado
- [x] Labels visibles y asociados en inputs/select/search (validación estática en código)

---

## 4) Loading / Error states visuales
- [x] Home (validación estática en código)
- [x] Collections (validación estática en código)
- [x] Collection Detail (validación estática en código)
- [x] Study (validación estática en código)

---

## Issues encontrados
- [ ] No hay issues
- [x] Hay issues (listar abajo)

### Lista de issues
1. Falta validación manual de flujos funcionales end-to-end (CRUD, navegación, retry) por pantalla.
2. Falta revisión cross-browser básica en Chrome/Edge/Firefox.
3. Falta revisión manual de accesibilidad por teclado/foco/contraste en ejecución real.
4. Posible mejora a11y de navegación: revisar composición `NavLink` + `HeaderMenuItem` en `MainNav`.

---

## Evidencia automática ejecutada

- [x] `npm run lint` (OK)
- [x] `npm run build` (OK)
- [ ] Bundle size warning revisado para optimización (no bloqueante QA de esta fase)