export default function MovieDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-950 pb-20 animate-pulse">
      <div className="border-b border-gray-900 bg-gray-900/40 h-14" />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-sm aspect-[2/3] bg-gray-900 rounded-2xl" />
          </div>
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-6 w-32 bg-gray-900 rounded-lg" />
            <div className="h-10 w-3/4 bg-gray-900 rounded-lg" />
            <div className="h-24 w-full bg-gray-900 rounded-2xl mt-4" />
            <div className="h-40 w-full bg-gray-900 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
