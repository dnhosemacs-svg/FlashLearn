import SkeletonCarbon from '../../ui-carbon/SkeletonCarbon'

interface CollectionListSkeletonProps {
  count?: number
}

export default function CollectionListSkeleton({ count = 4 }: CollectionListSkeletonProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <SkeletonCarbon className="mb-3 h-5 w-2/3" />
          <SkeletonCarbon className="mb-2 h-4 w-full" />
          <SkeletonCarbon className="mb-4 h-4 w-5/6" />
          <div className="flex gap-2">
            <SkeletonCarbon className="h-8 w-20" />
            <SkeletonCarbon className="h-8 w-20" />
            <SkeletonCarbon className="h-8 w-20" />
          </div>
        </div>
      ))}
    </section>
  )
}
