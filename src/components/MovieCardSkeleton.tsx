export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-800">
      {/* Poster placeholder */}
      <div className="aspect-[2/3] w-full bg-gray-800" />
      {/* Text placeholders */}
      <div className="p-2.5 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-800" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-gray-800" />
          <div className="h-3 w-14 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
