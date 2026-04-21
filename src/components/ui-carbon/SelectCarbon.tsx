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
  return (
    <div className="fl-select-carbon">
      <Select
        id={id}
        labelText={label}
        size="sm"
        value={value}
        className={cn(className)}
        onChange={(event) => onChange((event.target as HTMLSelectElement).value)}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} text={option.label} />
        ))}
      </Select>
    </div>
  )
}
