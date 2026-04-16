# Wrappers Carbon - ejemplos de uso

Guía rápida de consumo de wrappers temporales en `src/components/ui-carbon/`.

## ButtonCarbon

```tsx
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'

<ButtonCarbon variant="primary">Guardar</ButtonCarbon>
<ButtonCarbon variant="secondary" size="sm">Volver</ButtonCarbon>
<ButtonCarbon variant="danger" size="md">Borrar</ButtonCarbon>
<ButtonCarbon variant="ghost" fullWidth>Cancelar</ButtonCarbon>
```

## InputCarbon

```tsx
import InputCarbon from '../components/ui-carbon/InputCarbon'

<InputCarbon
  id="collection-name"
  label="Nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<InputCarbon
  id="collection-description"
  label="Descripción"
  hint="Opcional"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<InputCarbon
  id="collection-error"
  label="Nombre"
  value={name}
  error="El nombre es obligatorio"
  onChange={(e) => setName(e.target.value)}
/>
```

## SearchCarbon

```tsx
import SearchCarbon from '../components/ui-carbon/SearchCarbon'

<SearchCarbon
  id="collections-search"
  label="Buscar"
  value={query}
  placeholder="Buscar colecciones..."
  onChange={setQuery}
/>
```

## Notas de uso

- Mantener props cercanas a API legacy durante Fase 10 para minimizar refactor.
- Migrar por pantalla, evitando mezclar wrapper nuevo y componente legacy equivalente sin criterio.
- Referencia de decisiones: `docs/carbon/carbon-component-mapping.md`.
