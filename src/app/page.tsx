import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  Tv,
  Film,
  Compass,
  Calendar,
  Layers,
  Flame,
  Radio,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import DirectoryTable from '@/components/DirectoryTable';
import LanguageCard from '@/components/LanguageCard';
import { createAdminClient } from '@/lib/supabase';
import { SAMPLE_MOVIES } from '@/lib/seed-data';
import { GENRES, getYearRange, type Movie } from '@/types';
import { slugify } from '@/lib/utils';

async function getMovies(): Promise<{
  all: Movie[];
  latest: Movie[];
  trending: Movie[];
  webSeries: Movie[];
  recentlyUpdated: Movie[];
}> {
  try {
    const supabase = createAdminClient();

    const [latestRes, trendingRes, seriesRes, updatedRes] = await Promise.all([
      supabase.from('movies').select('*').order('created_at', { ascending: false }).limit(24),
      supabase.from('movies').select('*').order('view_count', { ascending: false }).limit(12),
      supabase.from('movies').select('*').eq('is_web_series', true).order('created_at', { ascending: false }).limit(12),
      supabase.from('movies').select('*').order('updated_at', { ascending: false }).limit(12),
    ]);

    if (latestRes.data && latestRes.data.length > 0) {
      return {
        all: latestRes.data as Movie[],
        latest: (latestRes.data as Movie[]).slice(0, 12),
        trending: (trendingRes.data as Movie[]) || (latestRes.data as Movie[]).slice(0, 12),
        webSeries: (seriesRes.data as Movie[]) || [],
        recentlyUpdated: (updatedRes.data as Movie[]) || [],
      };
    }
  } catch (err) {
    console.warn('Supabase not configured or query failed, rendering initial catalogue data:', err);
  }

  // Graceful fallback for initial deployment
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
    all: fallbackMovies,
    latest: fallbackMovies.slice(0, 12),
    trending: [...fallbackMovies].sort((a, b) => b.view_count - a.view_count).slice(0, 12),
    webSeries: fallbackMovies.filter((m) => m.is_web_series),
    recentlyUpdated: fallbackMovies.slice(0, 12),
  };
}

export default async function HomePage() {
  const { all, latest, trending, webSeries, recentlyUpdated } = await getMovies();
  const years = getYearRange().slice(0, 8); // 2026 down to 2019
  const mainLanguages = ['Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Hindi', 'English'];

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* 1. TOP ANNOUNCEMENT NOTICE BOX (1TamilMV authentic alert) */}
      <div className="mx-auto max-w-7xl w-full px-3 sm:px-6 pt-3">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-gray-200">
              <strong className="text-amber-400">OFFICIAL NOTICE:</strong> Bookmark our permanent domain.{' '}
              <span className="text-gray-300 hidden md:inline">
                All download links are powered by verified high-speed mirrors via our monetization partner ShrinkMe.
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto 15m Sync
            </span>
            <Link
              href="/browse?sort=newest"
              className="text-amber-400 hover:text-amber-300 font-bold underline text-[11px]"
            >
              Latest Added &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 2. QUICK LANGUAGE & YEAR PILLS BAR */}
      <div className="mx-auto max-w-7xl w-full px-3 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase text-gray-500 shrink-0 pr-1">
            Quick Hub:
          </span>
          <Link
            href="/browse?language=Tamil&year=2026"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-emerald-400 hover:bg-[#192233] shrink-0"
          >
            Tamil 2026
          </Link>
          <Link
            href="/browse?language=Telugu&year=2026"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-amber-400 hover:bg-[#192233] shrink-0"
          >
            Telugu 2026
          </Link>
          <Link
            href="/browse?language=Malayalam"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-gray-300 hover:text-white hover:bg-[#192233] shrink-0"
          >
            Malayalam
          </Link>
          <Link
            href="/browse?language=Hindi"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-blue-400 hover:bg-[#192233] shrink-0"
          >
            Hindi Dubbed
          </Link>
          <Link
            href="/browse?category=Web+Series"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-purple-400 hover:bg-[#192233] shrink-0"
          >
            Web Series / OTT
          </Link>
          <Link
            href="/browse?genre=Action"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-gray-300 hover:text-white hover:bg-[#192233] shrink-0"
          >
            Action
          </Link>
          <Link
            href="/browse?sort=popular"
            className="rounded px-2.5 py-1 text-xs font-bold bg-[#111722] border border-[#1f293d] text-red-400 hover:bg-[#192233] shrink-0"
          >
            Top Hits
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-3 sm:px-6 space-y-8">
        {/* 3. LATEST ADDITIONS (Poster Grid) */}
        <MovieGrid
          title="Latest Additions &amp; New Prints"
          subtitle="Newly indexed high-definition releases across all languages"
          movies={latest}
          viewAllHref="/browse?sort=newest"
          icon={<Sparkles className="h-4 w-4 text-emerald-400" />}
        />

        {/* 4. LIVE DIRECTORY TABLE (The 1TamilMV Invision Forum / Table layout) */}
        <DirectoryTable movies={all} />

        {/* 5. TRENDING / POPULAR MOVIES */}
        <MovieGrid
          title="Trending &amp; Most Downloaded"
          subtitle="Top viewed titles based on visitor download activity"
          movies={trending}
          viewAllHref="/browse?sort=popular"
          icon={<Flame className="h-4 w-4 text-amber-400" />}
        />

        {/* 6. LATEST WEB SERIES */}
        {webSeries.length > 0 && (
          <MovieGrid
            title="Latest Web Series &amp; OTT Seasons"
            subtitle="Complete seasons, multi-audio episodes, and exclusive OTT drops"
            movies={webSeries}
            viewAllHref="/browse?category=Web+Series"
            icon={<Tv className="h-4 w-4 text-purple-400" />}
          />
        )}

        {/* 7. BROWSE BY LANGUAGE */}
        <section className="w-full">
          <div className="mb-3 flex items-center justify-between border-b border-[#1f293d] pb-2">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Browse By Language
              </h2>
            </div>
            <Link
              href="/browse"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              All Languages &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {mainLanguages.map((lang) => (
              <LanguageCard key={lang} language={lang} />
            ))}
          </div>
        </section>

        {/* 8. BROWSE BY YEAR */}
        <section className="rounded-lg border border-[#1f293d] bg-[#0d121c] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Browse By Release Year
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <Link
                key={year}
                href={`/browse?year=${year}`}
                className="rounded bg-[#111722] border border-[#1f293d] hover:border-emerald-500/50 hover:bg-[#192233] px-4 py-2 text-xs font-bold text-gray-200 hover:text-emerald-400 transition-colors"
              >
                {year} Movies
              </Link>
            ))}
            <Link
              href="/browse"
              className="rounded bg-[#182130] border border-[#2d3b55] px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              All Past Years &rarr;
            </Link>
          </div>
        </section>

        {/* 9. BROWSE BY GENRE */}
        <section className="rounded-lg border border-[#1f293d] bg-[#0d121c] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Film className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Browse By Genre
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((genre) => (
              <Link
                key={genre}
                href={`/browse?genre=${encodeURIComponent(genre)}`}
                className="rounded bg-[#111722] border border-[#1f293d] hover:border-emerald-500/50 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-emerald-400 transition-colors"
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
