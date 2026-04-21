import { Select, SelectItem } from '@carbon/react'

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
}

export default function SelectCarbon({
  id,
  label,
  value,
  options,
  onChange,
}: SelectCarbonProps) {
  return (
    <Select
      id={id}
      labelText={label}
      value={value}
      onChange={(event) => onChange((event.target as HTMLSelectElement).value)}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value} text={option.label} />
      ))}
    </Select>
  )
}
