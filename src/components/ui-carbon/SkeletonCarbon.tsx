import { SkeletonPlaceholder } from '@carbon/react'

interface SkeletonCarbonProps {
  className?: string
}

export default function SkeletonCarbon({ className = '' }: SkeletonCarbonProps) {
  return (
    // Wrapper para normalizar placeholders de carga en layouts distintos.
    <div className={className} aria-hidden="true">
      <SkeletonPlaceholder className="h-full w-full" />
    </div>
  )
}
