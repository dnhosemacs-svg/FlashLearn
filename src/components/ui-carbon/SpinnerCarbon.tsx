import { InlineLoading } from '@carbon/react'

interface SpinnerCarbonProps {
  label?: string
}

export default function SpinnerCarbon({ label = 'Cargando' }: SpinnerCarbonProps) {
  return (
    <InlineLoading
      status="active"
      description={`${label}...`}
      iconDescription={label}
      aria-live="polite"
    />
  )
}
