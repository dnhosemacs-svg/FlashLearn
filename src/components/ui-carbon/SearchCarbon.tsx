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
  return (
    <div className="fl-search-carbon">
      <Search
        id={id}
        labelText={label}
        value={value}
        size="sm"
        className={cn(className)}
        placeholder={placeholder}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  )
}