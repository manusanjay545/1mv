'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Filter,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Film,
  RotateCcw,
} from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { LANGUAGES, GENRES, CATEGORIES, getYearRange, type Movie } from '@/types';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter states
  const search = searchParams.get('search') || '';
  const language = searchParams.get('language') || '';
  const year = searchParams.get('year') || '';
  const genre = searchParams.get('genre') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Update query params
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1'); // Reset to page 1 on filter change
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/browse?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    router.push('/browse');
  };

  // Fetch movies from API
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: '24',
      sort,
      ...(search ? { search } : {}),
      ...(language ? { language } : {}),
      ...(year ? { year } : {}),
      ...(genre ? { genre } : {}),
      ...(category ? { category } : {}),
    });

    fetch(`/api/movies?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data && Array.isArray(data.data)) {
            setMovies(data.data);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
          } else {
            setMovies([]);
            setTotal(0);
            setTotalPages(1);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Fetch movies error:', err);
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, language, year, genre, category, sort, page]);

  const hasActiveFilters = Boolean(search || language || year || genre || category || (sort && sort !== 'newest'));
  const years = getYearRange();

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header bar with active filter status */}
      <div className="border-b border-gray-900 bg-gray-900/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {language
                  ? `${language} Movies & Series`
                  : category
                  ? `${category} Catalogue`
                  : search
                  ? `Search: "${search}"`
                  : 'All Movies & Series'}
              </h1>
              <p className="mt-1 text-xs text-gray-400">
                {loading ? 'Searching catalogue...' : `Showing ${movies.length} of ${total} titles available`}
              </p>
            </div>

            {/* Mobile filter toggle + Desktop sort */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800"
              >
                <SlidersHorizontal className="h-4 w-4 text-rose-500" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-200 outline-none focus:border-rose-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              sidebarOpen ? 'block' : 'hidden'
            } rounded-2xl border border-gray-900 bg-gray-900/50 p-5 backdrop-blur-sm self-start`}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                <Filter className="h-4 w-4 text-rose-500" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5 text-sm">
              {/* Search input */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Keyword Search
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFilter('search', searchInput.trim());
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Title or keywords..."
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 pl-9 text-xs text-white placeholder-gray-500 outline-none focus:border-rose-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        updateFilter('search', '');
                      }}
                      className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Language */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="">All Languages</option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => updateFilter('genre', e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="">All Genres</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Year */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Release Year
                </label>
                <select
                  value={year}
                  onChange={(e) => updateFilter('year', e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Results Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="rounded-2xl border border-gray-900 bg-gray-900/30 p-12 text-center">
                <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No movies match your filters</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                  Try adjusting your language, genre or keyword search to see more titles.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                      className="rounded-xl border border-gray-800 bg-gray-900 p-2.5 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1 text-xs">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let p = i + 1;
                        if (totalPages > 5 && page > 3) {
                          p = page - 2 + i;
                          if (p > totalPages) p = totalPages - (4 - i);
                        }
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 w-9 rounded-xl font-semibold transition-colors ${
                              page === p
                                ? 'bg-rose-600 text-white'
                                : 'border border-gray-800 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                      className="rounded-xl border border-gray-800 bg-gray-900 p-2.5 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 p-8 text-center text-gray-500">
          Loading catalogue...
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
