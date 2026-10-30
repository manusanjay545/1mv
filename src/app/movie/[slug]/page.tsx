import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Eye,
  Film,
  HardDrive,
  Globe,
  Tag,
  ArrowLeft,
  Sparkles,
  Share2,
} from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';
import MovieGrid from '@/components/MovieGrid';
import { createAdminClient } from '@/lib/supabase';
import { SAMPLE_MOVIES } from '@/lib/seed-data';
import { formatDate, slugify } from '@/lib/utils';
import type { Movie, Destination } from '@/types';

interface MovieDetailProps {
  params: Promise<{ slug: string }>;
}

async function getMovieAndDestinations(slug: string): Promise<{
  movie: Movie | null;
  destinations: Destination[];
  related: Movie[];
}> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch movie
    const { data: movie, error } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (movie) {
      // Increment view count
      supabase
        .from('movies')
        .update({ view_count: (movie.view_count || 0) + 1 })
        .eq('id', movie.id)
        .then();

      // 2. Fetch destinations
      const { data: destinations } = await supabase
        .from('destinations')
        .select('*')
        .eq('movie_id', movie.id)
        .order('created_at', { ascending: true });

      // 3. Fetch related movies
      const { data: related } = await supabase
        .from('movies')
        .select('*')
        .eq('language', movie.language)
        .neq('id', movie.id)
        .limit(6);

      return {
        movie: movie as Movie,
        destinations: (destinations as Destination[]) || [],
        related: (related as Movie[]) || [],
      };
    }
  } catch (err) {
    console.warn('Supabase fetch failed, checking fallback:', err);
  }

  // Fallback demo matching
  const foundSample = SAMPLE_MOVIES.find((m) => slugify(m.title) === slug);
  if (!foundSample) return { movie: null, destinations: [], related: [] };

  const fallbackMovie: Movie = {
    id: `seed-${slug}`,
    source_id: `seed-${slug}`,
    title: foundSample.title,
    slug,
    description: foundSample.description,
    poster_url: foundSample.poster_url,
    release_year: foundSample.release_year,
    language: foundSample.language,
    genre: foundSample.genre,
    category: foundSample.category,
    source_url: null,
    quality: foundSample.quality,
    file_size: foundSample.file_size,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_synced_at: new Date().toISOString(),
    view_count: foundSample.view_count + 1,
    is_web_series: foundSample.is_web_series,
  };

  const fallbackDestinations: Destination[] = foundSample.destinations.map((d, i) => ({
    id: `dest-${i}`,
    movie_id: fallbackMovie.id,
    label: d.label,
    original_url: d.url,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const fallbackRelated: Movie[] = SAMPLE_MOVIES.filter(
    (m) => m.language === foundSample.language && slugify(m.title) !== slug
  )
    .slice(0, 6)
    .map((m, idx) => ({
      id: `rel-${idx}`,
      source_id: `rel-${idx}`,
      title: m.title,
      slug: slugify(m.title),
      description: m.description,
      poster_url: m.poster_url,
      release_year: m.release_year,
      language: m.language,
      genre: m.genre,
      category: m.category,
      source_url: null,
      quality: m.quality,
      file_size: m.file_size,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString(),
      view_count: m.view_count,
      is_web_series: m.is_web_series,
    }));

  return {
    movie: fallbackMovie,
    destinations: fallbackDestinations,
    related: fallbackRelated,
  };
}

export async function generateMetadata({ params }: MovieDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const { movie } = await getMovieAndDestinations(slug);

  if (!movie) {
    return {
      title: 'Movie Not Found — MovieVault',
    };
  }

  return {
    title: `${movie.title} (${movie.release_year || 'Movie'}) — Download & Watch | MovieVault`,
    description: movie.description || `Download ${movie.title} in high quality ${movie.quality || '1080p'}. Language: ${movie.language}.`,
    openGraph: {
      title: `${movie.title} — MovieVault`,
      description: movie.description || `Download ${movie.title} in ${movie.quality || 'HD'}.`,
      images: movie.poster_url ? [{ url: movie.poster_url }] : [],
    },
  };
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const { slug } = await params;
  const { movie, destinations, related } = await getMovieAndDestinations(slug);

  if (!movie) {
    notFound();
  }

  const posterSrc = movie.poster_url || '/placeholder-poster.svg';

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="border-b border-gray-900 bg-gray-900/40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>/</span>
            <Link href={`/browse?language=${movie.language}`} className="hover:text-gray-300">
              {movie.language}
            </Link>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-[180px]">{movie.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Movie Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Poster */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-gray-800">
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={posterSrc}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
                {movie.quality && (
                  <span className="absolute top-3 left-3 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                    {movie.quality}
                  </span>
                )}
                {movie.is_web_series && (
                  <span className="absolute top-3 right-3 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                    Web Series
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metadata Stats under poster */}
            <div className="w-full max-w-sm mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 text-center">
                <span className="text-gray-500 block">Total Views</span>
                <span className="text-sm font-semibold text-gray-200 mt-0.5 inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-rose-400" />
                  {movie.view_count.toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 text-center">
                <span className="text-gray-500 block">Release Year</span>
                <span className="text-sm font-semibold text-gray-200 mt-0.5 inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  {movie.release_year || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details & Downloads */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
            {/* Title & Badges */}
            <div className="border-b border-gray-900 pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.language && (
                  <span className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-400">
                    {movie.language}
                  </span>
                )}
                <span className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                  {movie.category || 'Movie'}
                </span>
                {movie.quality && (
                  <span className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-medium text-amber-400">
                    {movie.quality}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              {movie.published_at && (
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Added on {formatDate(movie.published_at)}
                </p>
              )}
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 rounded-2xl border border-gray-900 bg-gray-900/40 p-4">
              <div>
                <span className="text-xs text-gray-500 block">Language</span>
                <span className="text-sm font-medium text-gray-200">{movie.language || 'Multiple'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">File Size</span>
                <span className="text-sm font-medium text-gray-200">{movie.file_size || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Quality</span>
                <span className="text-sm font-medium text-gray-200">{movie.quality || '1080p HD'}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-xs text-gray-500 block mb-1.5">Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genre?.map((g) => (
                    <Link
                      key={g}
                      href={`/browse?genre=${encodeURIComponent(g)}`}
                      className="rounded-md bg-gray-800 hover:bg-gray-700 px-2.5 py-1 text-xs text-gray-300 transition-colors"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {movie.description && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Synopsis / Overview
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed bg-gray-900/20 p-4 rounded-xl border border-gray-900">
                  {movie.description}
                </p>
              </div>
            )}

            {/* DOWNLOAD SECTION (Mandatory ShrinkMe Integration) */}
            <div className="mt-2 rounded-2xl border-2 border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-gray-900/90 to-gray-900 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-rose-400" />
                <h2 className="text-xl font-bold text-white">Download Links</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                Click download to generate a secure link via our monetization partner ShrinkMe.
              </p>

              {/* Primary Download Button */}
              <div className="mb-6">
                <DownloadButton
                  movieId={movie.id}
                  size="large"
                  label={`Download ${movie.quality || 'Movie'} [${movie.file_size || 'Fast Speed'}]`}
                  showNotice={true}
                />
              </div>

              {/* Multiple Quality / Episode Links if available */}
              {destinations.length > 0 && (
                <div className="border-t border-gray-800/80 pt-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Available Prints & Mirrors ({destinations.length})
                  </h4>
                  <div className="space-y-2.5">
                    {destinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Film className="h-4 w-4 text-rose-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-200">
                            {dest.label || 'Direct High Speed Server'}
                          </span>
                        </div>
                        <DownloadButton
                          movieId={movie.id}
                          destinationId={dest.id}
                          originalUrl={dest.original_url}
                          label="Download"
                          size="normal"
                          showNotice={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-900 pt-12">
            <MovieGrid
              title={`More ${movie.language} Movies You Might Like`}
              movies={related}
              viewAllHref={`/browse?language=${encodeURIComponent(movie.language || '')}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
