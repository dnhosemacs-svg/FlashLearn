import type { ChangeEvent } from 'react'
import { Search } from '@carbon/react'
import { cn } from '../../lib/cn'

interface SearchCarbonProps {
  id: string
  label?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

export default function SearchCarbon({
  id,
  label = '',
  value,
  placeholder,
  onChange,
  className,
}: SearchCarbonProps) {
  // Normaliza el valor emitido para que los consumidores no dependan del evento DOM.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    // Wrapper para aplicar estilos globales de búsqueda sin repetir clases.
    <div className="fl-search-carbon">
      <Search
        id={id}
        labelText={label}
        value={value}
        size="sm"
        className={cn(className)}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  )
}