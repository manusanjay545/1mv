import MovieCardSkeleton from '@/components/MovieCardSkeleton';

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-gray-950 pb-20 animate-pulse">
      <div className="border-b border-gray-900 bg-gray-900/40 h-24" />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-96 rounded-2xl bg-gray-900/40 border border-gray-900" />
          <div className="lg:col-span-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

