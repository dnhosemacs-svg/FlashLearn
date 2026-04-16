import { Search } from '@carbon/react'

interface SearchCarbonProps {
  id: string
  label?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function SearchCarbon({
  id,
  label = '',
  value,
  placeholder,
  onChange,
}: SearchCarbonProps) {
  return (
    <Search
      id={id}
      labelText={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
    />
  )
}