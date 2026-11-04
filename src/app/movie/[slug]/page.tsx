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
  Download,
  ShieldCheck,
  CheckCircle,
  FileVideo,
  Volume2,
  Subtitles,
  Monitor,
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
    const { data: movie } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (movie) {
      // Increment view count asynchronously
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
    title: `${movie.title} (${movie.release_year || 'Movie'}) [${movie.quality || '1080p'}] — Download | MovieVault`,
    description: movie.description || `Download ${movie.title} in ${movie.quality || '1080p HQ'}. Language: ${movie.language}.`,
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
  const quality = movie.quality || '1080p HQ';
  const fileSize = movie.file_size || '1.4 GB';

  // Standard multi-tier download mirrors typical of 1TamilMV
  const defaultMirrors = [
    { label: `${movie.title} - 1080p WEB-DL - DD+5.1 [${fileSize}]`, quality: '1080p Proper' },
    { label: `${movie.title} - 720p HQ HDRip - x264 [900 MB]`, quality: '720p HD' },
    { label: `${movie.title} - 480p Clean Audio [450 MB]`, quality: '480p SD' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] pb-16">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-[#1f293d] bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalogue</span>
          </Link>

          <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden text-[11px]">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href={`/browse?language=${movie.language}`} className="hover:text-emerald-400 text-gray-400">
              {movie.language}
            </Link>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-[200px] font-medium">{movie.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-3 sm:px-6 pt-5">
        {/* FORUM TOPIC CONTAINER (1TamilMV Style) */}
        <div className="rounded-lg border border-[#1f293d] bg-[#0d121c] overflow-hidden shadow-2xl">
          {/* Main Title Banner */}
          <div className="border-b border-[#1f293d] bg-[#121824] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="rounded bg-emerald-500 text-black px-2 py-0.5 text-[11px] font-black uppercase">
                {quality}
              </span>
              {movie.language && (
                <span className="rounded bg-[#1b2434] border border-[#2d3b55] text-gray-300 px-2 py-0.5 text-[11px] font-bold">
                  {movie.language}
                </span>
              )}
              {movie.is_web_series && (
                <span className="rounded bg-purple-600 text-white px-2 py-0.5 text-[11px] font-black">
                  WEB SERIES
                </span>
              )}
              {movie.release_year && (
                <span className="rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 text-[11px] font-bold">
                  {movie.release_year}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
              {movie.title}{' '}
              <span className="text-emerald-400 font-extrabold">
                ({movie.release_year || '2024'})
              </span>{' '}
              <span className="text-gray-400 font-normal text-sm sm:text-base">
                [{movie.language || 'Multi'} - {quality} - x264 - DD+5.1 - {fileSize}]
              </span>
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Published: {movie.published_at ? formatDate(movie.published_at) : 'Recent'}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Eye className="h-3.5 w-3.5" />
                {movie.view_count.toLocaleString()} Views
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <HardDrive className="h-3.5 w-3.5" />
                Size: {fileSize}
              </span>
            </div>
          </div>

          {/* Details & Specs Box */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Poster */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[240px] aspect-[2/3] overflow-hidden rounded-lg bg-[#0b0e14] border border-[#1f293d] shadow-lg">
                <Image
                  src={posterSrc}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-2 left-2 rounded bg-black/85 border border-emerald-500/40 px-1.5 py-0.5 text-[10px] font-black text-emerald-400">
                  {quality}
                </span>
              </div>

              {/* Quick Jump to Download */}
              <a
                href="#download-section"
                className="w-full max-w-[240px] mt-3 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs text-center uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Jump to Downloads</span>
              </a>
            </div>

            {/* Right: Technical Mediainfo Specifications */}
            <div className="md:col-span-8 space-y-4">
              <div className="rounded-lg border border-[#1f293d] bg-[#111722] p-4 text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 text-emerald-400 border-b border-[#1f293d] pb-2">
                  <Film className="h-4 w-4" />
                  <span>Media Information &amp; Technical Specs</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-500" /> Language:
                    </span>
                    <span className="font-bold text-white">{movie.language || 'Tamil'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Monitor className="h-3 w-3 text-gray-500" /> Quality / Resolution:
                    </span>
                    <span className="font-bold text-emerald-400">{quality}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Volume2 className="h-3 w-3 text-gray-500" /> Audio Specs:
                    </span>
                    <span className="font-bold text-gray-200">Dolby Digital+ 5.1</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <HardDrive className="h-3 w-3 text-gray-500" /> File Size:
                    </span>
                    <span className="font-bold text-amber-400">{fileSize}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Subtitles className="h-3 w-3 text-gray-500" /> Subtitles:
                    </span>
                    <span className="font-bold text-gray-300">English [Muxed]</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#0d121c] border border-[#1f293d]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" /> Release Year:
                    </span>
                    <span className="font-bold text-gray-200">{movie.release_year || '2024'}</span>
                  </div>
                </div>

                {/* Genre badges */}
                {movie.genre && movie.genre.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#1f293d] flex items-center gap-2">
                    <span className="text-gray-400 text-[11px]">Genres:</span>
                    <div className="flex flex-wrap gap-1">
                      {movie.genre.map((g) => (
                        <Link
                          key={g}
                          href={`/browse?genre=${encodeURIComponent(g)}`}
                          className="px-2 py-0.5 rounded bg-[#182130] text-gray-300 hover:text-emerald-400 text-[11px] font-semibold"
                        >
                          {g}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Synopsis / Description */}
              {movie.description && (
                <div className="rounded-lg border border-[#1f293d] bg-[#111722] p-4 text-xs">
                  <h4 className="font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Synopsis / Storyline
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* 1TamilMV SIGNATURE SCREENSHOTS PREVIEW BANNER */}
          <div className="border-t border-[#1f293d] bg-[#121824] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Screenshots / Quality Sample Frame Previews</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="relative aspect-video rounded bg-[#0b0e14] border border-[#1f293d] overflow-hidden flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-500">1080p FHD Sample 1</span>
              </div>
              <div className="relative aspect-video rounded bg-[#0b0e14] border border-[#1f293d] overflow-hidden flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-500">1080p FHD Sample 2</span>
              </div>
              <div className="hidden sm:flex relative aspect-video rounded bg-[#0b0e14] border border-[#1f293d] overflow-hidden items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-500">Audio 5.1 TrueHD Sample</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MANDATORY SHRINKME MONETIZED DOWNLOAD HUB                      */}
          {/* ============================================================== */}
          <div
            id="download-section"
            className="border-t-2 border-emerald-500 bg-gradient-to-b from-[#111a26] via-[#0d121c] to-[#0b0e14] p-5 sm:p-8"
          >
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400 mb-2">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Verified Direct Download Mirrors</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Download {movie.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Select your preferred quality print below to start fast download.
              </p>
            </div>

            {/* Main Primary Download CTA */}
            <div className="flex flex-col items-center mb-8">
              <DownloadButton
                movieId={movie.id}
                size="large"
                label={`Download Now [${quality} • ${fileSize}]`}
                showNotice={true}
              />
            </div>

            {/* Mirror Links Box (like 1TamilMV Multi-quality lists) */}
            <div className="rounded-lg border border-[#1f293d] bg-[#111722] overflow-hidden">
              <div className="bg-[#161f2e] px-4 py-2.5 border-b border-[#1f293d] flex items-center justify-between text-xs font-bold text-gray-300 uppercase">
                <span>Available Server Mirrors &amp; Qualities</span>
                <span className="text-emerald-400 text-[11px]">100% Virus Free</span>
              </div>

              <div className="divide-y divide-[#1f293d]">
                {(destinations.length > 0 ? destinations : defaultMirrors).map((mirror, idx) => {
                  const label = 'label' in mirror ? mirror.label : `Mirror Server ${idx + 1}`;
                  const mirrorQuality =
                    'quality' in mirror
                      ? (mirror as { quality: string }).quality
                      : idx === 0
                      ? '1080p FHD'
                      : idx === 1
                      ? '720p HD'
                      : '480p SD';

                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-4 gap-3 hover:bg-[#161f2e] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileVideo className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {label || `Server Mirror ${idx + 1}`}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Fast CDN &bull; Resumable Download
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {mirrorQuality}
                        </span>
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
            </div>

            {/* Ad & Monetization Advisory */}
            <div className="mt-4 p-3 rounded bg-[#111722]/50 border border-[#1f293d] text-[11px] text-gray-400 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Notice:</strong> All downloads are routed through our verified advertising
                redirect (ShrinkMe) to cover server hosting expenses. After completing the sponsored
                step, your download starts immediately. Thank you for your support!
              </span>
            </div>
          </div>
        </div>

        {/* Related Titles */}
        {related.length > 0 && (
          <div className="mt-12">
            <MovieGrid
              title={`Related ${movie.language} Releases You May Like`}
              movies={related}
              viewAllHref={`/browse?language=${encodeURIComponent(movie.language || '')}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
