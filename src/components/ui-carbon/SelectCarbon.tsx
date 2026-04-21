import type { ChangeEvent } from 'react'
import { Select, SelectItem } from '@carbon/react'
import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectCarbonProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
}

export default function SelectCarbon({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: SelectCarbonProps) {
  // Expone una API simple por valor para mantener este wrapper desacoplado del DOM.
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    // Wrapper para reutilizar estilos de select Carbon en toda la app.
    <div className="fl-select-carbon">
      <Select
        id={id}
        labelText={label}
        size="sm"
        value={value}
        className={cn(className)}
        onChange={handleChange}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} text={option.label} />
        ))}
      </Select>
    </div>
  )
}
