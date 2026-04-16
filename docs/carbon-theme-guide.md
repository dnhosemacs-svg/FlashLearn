# Carbon Theme Guide

## Objetivo

Unificar decisiones visuales de Fase 10 usando IBM Carbon sin romper la estética previa de FlashLearn.

## Decisiones activas

- Tema base: `g10`
- Sin toggle de tema en esta fase
- Estados semánticos con variantes/tokens de Carbon
- Densidad visual: media

## Criterio de coherencia visual

- Mantener interfaz clara y legible.
- Preservar jerarquía visual actual en títulos, formularios y listas.
- Migrar por capas (componentes base primero) para evitar saltos bruscos entre pantallas.

## Reglas de implementación

1. Usar componentes Carbon en los nuevos bloques migrados.
2. Preferir tokens y variantes de Carbon antes que valores hardcodeados.
3. Evitar nuevos colores semánticos manuales para éxito/error/warning/info.
4. Mantener consistencia de spacing entre páginas (no mezclar múltiples escalas).

## Do / Don't

- Do: usar estados visuales y componentes de feedback de Carbon.
- Do: validar contraste y legibilidad tras cada bloque migrado.
- Don't: mezclar nuevos componentes Carbon con estilos legacy sin criterio de transición.
- Don't: introducir cambios de lógica en hooks/context/api en esta fase.

## Referencias

- `docs/phase-10-ibm-carbon.md`
- `docs/design.md` (sección de theming y tokens)
- `docs/carbon-setup.md`
