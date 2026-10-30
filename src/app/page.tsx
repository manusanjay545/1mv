import Link from 'next/link';
import { Sparkles, TrendingUp, Tv, Film, Compass, Calendar, Layers } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import LanguageCard from '@/components/LanguageCard';
import { createAdminClient } from '@/lib/supabase';
import { SAMPLE_MOVIES } from '@/lib/seed-data';
import { GENRES, getYearRange, type Movie } from '@/types';
import { slugify } from '@/lib/utils';

async function getMovies(): Promise<{
  latest: Movie[];
  trending: Movie[];
  webSeries: Movie[];
  recentlyUpdated: Movie[];
}> {
  try {
    const supabase = createAdminClient();

    const [latestRes, trendingRes, seriesRes, updatedRes] = await Promise.all([
      supabase.from('movies').select('*').order('created_at', { ascending: false }).limit(12),
      supabase.from('movies').select('*').order('view_count', { ascending: false }).limit(12),
      supabase.from('movies').select('*').eq('is_web_series', true).order('created_at', { ascending: false }).limit(12),
      supabase.from('movies').select('*').order('updated_at', { ascending: false }).limit(6),
    ]);

    if (latestRes.data && latestRes.data.length > 0) {
      return {
        latest: latestRes.data as Movie[],
        trending: (trendingRes.data as Movie[]) || (latestRes.data as Movie[]),
        webSeries: (seriesRes.data as Movie[]) || [],
        recentlyUpdated: (updatedRes.data as Movie[]) || [],
      };
    }
  } catch (err) {
    console.warn('Supabase not configured or query failed, rendering initial catalogue data:', err);
  }

  // Graceful fallback for preview / initial deployment
  const fallbackMovies: Movie[] = SAMPLE_MOVIES.map((m, index) => ({
    id: `seed-${index}`,
    source_id: `seed-${index}`,
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
    published_at: new Date(Date.now() - index * 3600000).toISOString(),
    created_at: new Date(Date.now() - index * 3600000).toISOString(),
    updated_at: new Date(Date.now() - index * 3600000).toISOString(),
    last_synced_at: new Date().toISOString(),
    view_count: m.view_count,
    is_web_series: m.is_web_series,
  }));

  return {
    latest: fallbackMovies.slice(0, 12),
    trending: [...fallbackMovies].sort((a, b) => b.view_count - a.view_count).slice(0, 12),
    webSeries: fallbackMovies.filter((m) => m.is_web_series),
    recentlyUpdated: fallbackMovies.slice(0, 6),
  };
}

export default async function HomePage() {
  const { latest, trending, webSeries, recentlyUpdated } = await getMovies();
  const years = getYearRange().slice(0, 7); // 2026 down to 2020
  const mainLanguages = ['Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Hindi', 'English'];

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-900 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 py-16 sm:py-24">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-400 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Updated Every 15 Minutes &bull; High Quality Downloads</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Discover & Download <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 bg-clip-text text-transparent">Movies</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Comprehensive South Indian and Bollywood movie directory. Browse Tamil, Telugu, Malayalam,
            Hindi, and English releases in 4K, 1080p and 720p.
          </p>

          <div className="max-w-xl mx-auto">
            <SearchBar large placeholder="Search by title, actor, language or genre..." />
          </div>

          {/* Quick Language Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-gray-500 mr-1">Quick Browse:</span>
            {mainLanguages.map((lang) => (
              <Link
                key={lang}
                href={`/browse?language=${encodeURIComponent(lang)}`}
                className="rounded-full bg-gray-900/80 hover:bg-rose-900/40 border border-gray-800 hover:border-rose-500/40 px-3 py-1 text-xs text-gray-300 transition-colors"
              >
                {lang}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 1. Latest Additions */}
        <MovieGrid
          title="Latest Additions"
          movies={latest}
          viewAllHref="/browse?sort=newest"
        />

        {/* 2. Recently Updated */}
        {recentlyUpdated.length > 0 && (
          <section className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-rose-400 font-semibold text-sm uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>Recently Updated Prints & Audios</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {recentlyUpdated.map((m) => (
                <Link
                  key={`updated-${m.id}`}
                  href={`/movie/${m.slug}`}
                  className="p-3 rounded-xl bg-gray-900/80 border border-gray-800/80 hover:border-rose-500/50 hover:bg-gray-800 transition-all flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-white line-clamp-1">{m.title}</span>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                    <span className="text-rose-400 font-medium">{m.quality || 'HDRip'}</span>
                    <span>{m.language}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Trending Movies */}
        <MovieGrid
          title="Trending Movies"
          movies={trending}
          viewAllHref="/browse?sort=popular"
        />

        {/* 4. Latest Web Series */}
        {webSeries.length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Tv className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Latest Web Series</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">Binge complete seasons and new weekly episodes</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
              {webSeries.map((s) => (
                <Link key={s.id} href={`/movie/${s.slug}`} className="group block">
                  <div className="overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-800 group-hover:ring-blue-500/50 transition-all duration-300 group-hover:scale-[1.03]">
                    <div className="relative aspect-[2/3] w-full">
                      <img
                        src={s.poster_url || '/placeholder-poster.svg'}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute top-2 right-2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Series
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                        {s.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                        <span>{s.release_year}</span>
                        <span>{s.language}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 5. Browse by Language */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Compass className="h-5 w-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Browse by Language</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainLanguages.map((lang) => (
              <LanguageCard key={lang} language={lang} />
            ))}
          </div>
        </section>

        {/* 6. Browse by Year */}
        <section className="rounded-2xl border border-gray-900 bg-gray-900/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Browse by Year</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {years.map((year) => (
              <Link
                key={year}
                href={`/browse?year=${year}`}
                className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-amber-500/50 hover:bg-gray-800 hover:text-white transition-all shadow-sm"
              >
                {year}
              </Link>
            ))}
            <Link
              href="/browse"
              className="rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              All Years &rarr;
            </Link>
          </div>
        </section>

        {/* 7. Browse by Genre */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Film className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Browse by Genre</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Link
                key={genre}
                href={`/browse?genre=${encodeURIComponent(genre)}`}
                className="rounded-lg border border-gray-800/80 bg-gray-900/90 px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:border-rose-500/50 hover:bg-rose-950/20 hover:text-white transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
