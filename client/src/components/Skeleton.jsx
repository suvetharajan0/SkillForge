export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-[#e1e3e4] dark:bg-white/10 rounded ${className}`} />
}


export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6">
      <Skeleton className="w-10 h-10 rounded-lg mb-4" />
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}