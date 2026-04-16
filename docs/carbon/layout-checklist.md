# Layout Checklist (Fase 10)

## Objetivo

Validar que el shell global y la navegación migrados a Carbon no rompen la experiencia actual.

## Breakpoints a revisar

### Mobile

- Header visible y usable.
- Navegación no rompe layout.
- Títulos y botones no desbordan.
- Formularios y listas ocupan ancho correcto.

### Tablet

- Header mantiene jerarquía visual.
- Grids de dos columnas no colapsan mal.
- Espaciado entre bloques sigue siendo consistente.

### Desktop

- Contenedor central con ancho máximo estable.
- Navegación alineada y legible.
- Páginas principales mantienen ritmo visual homogéneo.

## Pantallas a revisar

- `/`
- `/collections`
- `/collections/:collectionRef`
- `/study`

## Criterios de validación

- No se rompen rutas.
- No cambia la lógica de navegación.
- No aparece scroll horizontal inesperado.
- El shell visual se percibe consistente con tema `g10`.
