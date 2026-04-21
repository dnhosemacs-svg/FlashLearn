import { SkeletonPlaceholder } from '@carbon/react'

interface SkeletonCarbonProps {
  className?: string
}

export default function SkeletonCarbon({ className = '' }: SkeletonCarbonProps) {
  return (
    <div className={className} aria-hidden="true">
      <SkeletonPlaceholder className="h-full w-full" />
    </div>
  )
}
