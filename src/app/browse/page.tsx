'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Filter,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Film,
  RotateCcw,
  LayoutGrid,
  List,
  Calendar,
  HardDrive,
  Download,
} from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import DownloadButton from '@/components/DownloadButton';
import { LANGUAGES, GENRES, CATEGORIES, getYearRange, type Movie } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <div className="min-h-screen bg-[#0b0e14] pb-20">
      {/* Header bar with active filter status */}
      <div className="border-b border-[#1f293d] bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>
                  {language
                    ? `${language} Movies & Series`
                    : category
                    ? `${category} Catalogue`
                    : search
                    ? `Search: "${search}"`
                    : 'All Movie & Series Releases'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {total} Titles
                </span>
              </h1>
              <p className="mt-1 text-xs text-gray-400">
                {loading
                  ? 'Searching catalogue index...'
                  : `Showing page ${page} of ${totalPages} • Verified Fast Download Links`}
              </p>
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-2">
              {/* Toggle Grid / List view */}
              <div className="flex items-center rounded-lg border border-[#1f293d] bg-[#111722] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-[#1f293d] bg-[#111722] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#192233]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
                <span>Filters {hasActiveFilters && '(•)'}</span>
              </button>

              {/* Sort Selector */}
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="rounded-lg border border-[#1f293d] bg-[#111722] px-3 py-2 text-xs font-bold text-gray-200 outline-none focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              sidebarOpen ? 'block' : 'hidden'
            } rounded-lg border border-[#1f293d] bg-[#0d121c] p-4 self-start`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#1f293d] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                <Filter className="h-3.5 w-3.5 text-emerald-400" />
                <span>Filter Catalogue</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Keyword Search */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                  Search Keyword
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
                    placeholder="Search movie title..."
                    className="w-full rounded-md border border-[#1f293d] bg-[#111722] px-3 py-2 pl-8 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        updateFilter('search', '');
                      }}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </form>
              </div>

              {/* Language */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full rounded-md border border-[#1f293d] bg-[#111722] px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500"
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
                <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full rounded-md border border-[#1f293d] bg-[#111722] px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500"
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
                <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => updateFilter('genre', e.target.value)}
                  className="w-full rounded-md border border-[#1f293d] bg-[#111722] px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500"
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
                <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1.5">
                  Release Year
                </label>
                <select
                  value={year}
                  onChange={(e) => updateFilter('year', e.target.value)}
                  className="w-full rounded-md border border-[#1f293d] bg-[#111722] px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500"
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

          {/* Main Results Display */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="rounded-lg border border-[#1f293d] bg-[#0d121c] p-12 text-center">
                <Film className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  No titles match your selected filters
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Try clearing some filters or searching for a different language or movie name.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="rounded bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              /* DENSE 1TamilMV LIST VIEW */
              <div className="rounded-lg border border-[#1f293d] bg-[#0d121c] divide-y divide-[#1f293d] overflow-hidden">
                {movies.map((movie) => {
                  const quality = movie.quality || '1080p HQ';
                  const size = movie.file_size || '1.4 GB';
                  const poster = movie.poster_url || '/placeholder-poster.svg';

                  return (
                    <div
                      key={movie.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 hover:bg-[#121824] transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link
                          href={`/movie/${movie.slug}`}
                          className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-[#1f293d] border border-[#2d3b55]"
                        >
                          <Image
                            src={poster}
                            alt={movie.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            {movie.language && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/80 border border-white/10 text-gray-300">
                                {movie.language}
                              </span>
                            )}
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {quality}
                            </span>
                            {movie.release_year && (
                              <span className="text-[10px] font-semibold text-amber-400">
                                ({movie.release_year})
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/movie/${movie.slug}`}
                            className="block text-xs sm:text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors line-clamp-1"
                          >
                            {movie.title}{' '}
                            <span className="font-normal text-gray-400 text-xs">
                              [{movie.language || 'Multi'} - {quality} - {size}]
                            </span>
                          </Link>

                          <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1 text-gray-400">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              {movie.published_at ? formatRelativeTime(movie.published_at) : 'Recent'}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <HardDrive className="h-3 w-3" />
                              {size}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Link
                          href={`/movie/${movie.slug}`}
                          className="px-3 py-1.5 rounded bg-[#182130] hover:bg-[#1f293d] border border-[#2d3b55] text-xs font-semibold text-gray-300 hover:text-white"
                        >
                          View
                        </Link>
                        <DownloadButton
                          movieId={movie.id}
                          label="Download"
                          size="compact"
                          showNotice={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-lg border border-[#1f293d] bg-[#111722] p-2 text-gray-300 hover:bg-[#192233] disabled:opacity-30 disabled:pointer-events-none"
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
                        className={`h-8 w-8 rounded-lg font-bold text-xs transition-colors ${
                          page === p
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'border border-[#1f293d] bg-[#111722] text-gray-400 hover:text-white hover:bg-[#192233]'
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
                  className="rounded-lg border border-[#1f293d] bg-[#111722] p-2 text-gray-300 hover:bg-[#192233] disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
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
        <div className="min-h-screen bg-[#0b0e14] p-8 text-center text-gray-500 text-xs">
          Loading movie catalogue...
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
