# Gestión del proyecto FlashLearn

Este documento define cómo usamos el tablero (Trello) para planificar y cerrar trabajo de forma ordenada. El enlace al tablero está en el [README](../README.md).

---

## Columnas del tablero

Cada tarjeta representa una unidad de trabajo (tarea) con un resultado claro.

| Columna | Qué significa |
|--------|----------------|
| **Backlog** | Ideas y trabajo identificado, pero aún sin criterios de aceptación cerrados o sin fecha de ataque. No está “comprometido” para el corto plazo. |
| **Todo** | Trabajo listo para empezar: dependencias resueltas, descripción clara y criterios de aceptación acordados. Puede priorizarse dentro de la columna. |
| **In Progress** | Alguien está trabajando activamente en la tarea. Aquí solo deben vivir tareas en ejecución real, no “reservadas”. |
| **Review** | La implementación está hecha y pendiente de validación: revisión de código, prueba manual en entorno local/preview, o revisión de documentación asociada. |
| **Done** | Validada, documentada cuando aplica e integrada sin romper lo ya existente. Equivale al cierre formal de la tarea. |

Regla general: una tarjeta solo debe estar en una columna a la vez.

---

## Reglas de movimiento entre columnas

### De Backlog → Todo

- La tarea tiene **descripción suficiente** para que otra persona la pueda ejecutar sin adivinar el alcance.
- Los **criterios de aceptación** están escritos en la tarjeta (o enlazados en `docs/` si son largos).
- Están claras las **dependencias** (otra tarea, decisión de diseño, variable de entorno, etc.) y ya no bloquean el inicio.

### De Todo → In Progress

- Quién la mueve **se asigna** o deja claro en comentario que la está tomando.
- No se supera el **límite de trabajo en curso** acordado: máximo **2 tareas en In Progress** a la vez (una persona o el equipo, según acordéis). Si ya hay 2, se termina o se pasa a Review antes de abrir otra.

### De In Progress → Review

- El código o los cambios están **commiteados** en una rama o en `main` según la estrategia del equipo.
- La funcionalidad se puede **probar** localmente (frontend `npm run dev`, backend `npm run dev` en `server/`, etc.).
- Si la tarea exige documentación (por ejemplo actualizar `docs/api.md`), el borrador está **hecho o enlazado** en la tarjeta.

### De Review → Done

- Se cumple la sección **Criterios de “Done”** de este documento.
- Si hubo feedback en Review, está **aplicado o rechazado con motivo** (anotado en la tarjeta).

### De Review → In Progress (reapertura)

- Falla una prueba, surge un bug relacionado o falta un requisito acordado.
- Se añade un comentario con **qué falló** y qué falta para volver a Review.

### Regresiones

- Si algo en `Done` se rompe, se abre una **nueva tarjeta** (bug) o se mueve la afectada según severidad, pero no se deja el tablero con estados ambiguos.

---

## Criterios de “Done”

Una tarea se considera **Done** solo si se cumplen **todas** las condiciones que apliquen a su tipo:

1. **Funcional**: el comportamiento acordado funciona en el flujo previsto (happy path y casos explícitos en la tarjeta).
2. **Integración**: `npm run build` del frontend pasa sin errores; el backend arranca y los endpoints tocados responden como se espera.
3. **Regresiones**: no se introduce un fallo obvio en rutas o pantallas ya existentes (navegación básica, endpoints vivos).
4. **Documentación**: si la tarea cambia contrato API, rutas de usuario o convenciones, la documentación en `docs/` correspondiente está actualizada o existe un comentario en la tarjeta con enlace al PR/commit donde se hará en la siguiente iteración (solo en excepciones acordadas).
5. **Repositorio**: cambios **subidos** al repo remoto y la tarjeta enlaza al commit o PR cuando sea práctico.

Si algún criterio no aplica (por ejemplo, solo documentación), indícalo en la tarjeta al pasar a Review.

---

## Convención de etiquetas

Usar etiquetas de forma **consistente** para filtrar y priorizar. Propuesta mínima para FlashLearn:

| Etiqueta | Uso |
|---------|-----|
| `tipo:feature` | Nueva capacidad orientada al usuario. |
| `tipo:bug` | Comportamiento incorrecto o regresión. |
| `tipo:docs` | Solo documentación o aclaraciones en `docs/`. |
| `tipo:chore` | Herramientas, configuración, limpieza sin impacto directo en producto. |
| `area:frontend` | Cambios en `src/` (React, UI, cliente). |
| `area:backend` | Cambios en `server/` (API, servicios). |
| `area:deploy` | Vercel, Railway, variables de entorno, CI. |
| `prioridad:alta` | Bloquea entregas u otros trabajos; tratar antes. |
| `prioridad:baja` | Mejora o deuda técnica no urgente. |
| `bloqueado` | No puede avanzar por dependencia externa; describir en comentario qué falta. |

Reglas:

- Cada tarjeta activa debería tener al menos **una etiqueta `tipo:`** y **una `area:`** cuando el alcance sea mixto, usar la que represente el mayor esfuerzo.
- `bloqueado` puede combinarse con cualquier tipo; al desbloquear, quitar la etiqueta y mover la tarjeta según corresponda.

---

## Referencia rápida (columnas según avance)

- **Backlog** → definido pero no listo para ejecutar  
- **Todo** → listo para ejecutar  
- **In Progress** → en curso (máx. 2)  
- **Review** → hecho, pendiente de validar  
- **Done** → validado, documentado si aplica e integrado  

---

## FASE 10 - IBM Carbon (UI)

Documento de alcance:
- `docs/phase-10-ibm-carbon.md`
