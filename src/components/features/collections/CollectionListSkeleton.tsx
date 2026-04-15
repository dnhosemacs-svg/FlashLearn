import Skeleton from '../../ui/Skeleton'

interface CollectionListSkeletonProps {
  count?: number
}

export default function CollectionListSkeleton({ count = 4 }: CollectionListSkeletonProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
          <Skeleton className="mb-3 h-5 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-5/6" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </section>
  )
}
