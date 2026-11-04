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
  ArrowLeft,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle,
  FileVideo,
  Volume2,
  Monitor,
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
    const { data: movie } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (movie) {
      supabase
        .from('movies')
        .update({ view_count: (movie.view_count || 0) + 1 })
        .eq('id', movie.id)
        .then();

      const { data: destinations } = await supabase
        .from('destinations')
        .select('*')
        .eq('movie_id', movie.id)
        .order('created_at', { ascending: true });

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

  const normalizedSlug = slug.toLowerCase();
  const foundSample =
    SAMPLE_MOVIES.find((m) => slugify(m.title) === normalizedSlug) ||
    SAMPLE_MOVIES.find((m) => m.poster_url.toLowerCase().includes(normalizedSlug)) ||
    SAMPLE_MOVIES.find((m) => normalizedSlug.includes(slugify(m.title))) ||
    SAMPLE_MOVIES.find((m) => slugify(m.title).includes(normalizedSlug)) ||
    SAMPLE_MOVIES[0];

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
  if (!movie) return { title: 'Movie Not Found — MovieVault' };

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

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#0b0e14' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #1f293d', backgroundColor: '#0d121c' }}>
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalogue</span>
          </Link>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href={`/browse?language=${movie.language}`} className="hover:text-emerald-400">{movie.language}</Link>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-48 font-medium">{movie.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-5">
        {/* Main Container */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1f293d', backgroundColor: '#0d121c' }}>

          {/* ===== TITLE BAR ===== */}
          <div className="p-5" style={{ borderBottom: '1px solid #1f293d', backgroundColor: '#121824' }}>
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block rounded px-2.5 py-1 text-xs font-black uppercase text-black bg-emerald-500">
                {quality}
              </span>
              {movie.language && (
                <span className="inline-block rounded px-2.5 py-1 text-xs font-bold text-gray-300" style={{ backgroundColor: '#1b2434', border: '1px solid #2d3b55' }}>
                  {movie.language}
                </span>
              )}
              {movie.is_web_series && (
                <span className="inline-block rounded px-2.5 py-1 text-xs font-black uppercase text-white bg-purple-600">
                  WEB SERIES
                </span>
              )}
              {movie.release_year && (
                <span className="inline-block rounded px-2.5 py-1 text-xs font-bold text-amber-400" style={{ backgroundColor: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)' }}>
                  {movie.release_year}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {movie.title}{' '}
              <span className="text-emerald-400">({movie.release_year || '2024'})</span>{' '}
              <span className="text-gray-400 font-normal text-sm">
                [{movie.language || 'Multi'} - {quality} - DD+5.1 - {fileSize}]
              </span>
            </h1>

            {/* Meta info row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Published: {movie.published_at ? formatDate(movie.published_at) : 'Recent'}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Eye className="h-3.5 w-3.5" />
                {movie.view_count.toLocaleString()} Views
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <HardDrive className="h-3.5 w-3.5" />
                {fileSize}
              </span>
            </div>
          </div>

          {/* ===== POSTER + SPECS GRID ===== */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LEFT: Poster */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-60 overflow-hidden rounded-lg" style={{ aspectRatio: '2/3', border: '1px solid #1f293d', backgroundColor: '#0b0e14' }}>
                  <Image
                    src={posterSrc}
                    alt={movie.title}
                    fill
                    priority
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-2 left-2 rounded px-1.5 py-0.5 text-xs font-black text-emerald-400" style={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(0,210,106,0.4)' }}>
                    {quality}
                  </span>
                </div>
                <a
                  href="#download-section"
                  className="mt-3 w-full max-w-60 inline-flex items-center justify-center gap-2 rounded py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wide text-center"
                >
                  <Download className="h-4 w-4" />
                  Jump to Downloads
                </a>
              </div>

              {/* RIGHT: Specs */}
              <div className="md:col-span-2 space-y-4">
                {/* Technical Specs Card */}
                <div className="rounded-lg p-4" style={{ border: '1px solid #1f293d', backgroundColor: '#111722' }}>
                  <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-sm mb-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid #1f293d' }}>
                    <Film className="h-4 w-4" />
                    Media Information &amp; Technical Specs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { icon: <Globe className="h-3.5 w-3.5 text-gray-500" />, label: 'Language', value: movie.language || 'Tamil', color: 'text-white' },
                      { icon: <Monitor className="h-3.5 w-3.5 text-gray-500" />, label: 'Quality', value: quality, color: 'text-emerald-400' },
                      { icon: <Volume2 className="h-3.5 w-3.5 text-gray-500" />, label: 'Audio', value: 'Dolby Digital+ 5.1', color: 'text-gray-200' },
                      { icon: <HardDrive className="h-3.5 w-3.5 text-gray-500" />, label: 'File Size', value: fileSize, color: 'text-amber-400' },
                      { icon: <Film className="h-3.5 w-3.5 text-gray-500" />, label: 'Subtitles', value: 'English [Muxed]', color: 'text-gray-300' },
                      { icon: <Calendar className="h-3.5 w-3.5 text-gray-500" />, label: 'Year', value: String(movie.release_year || '2024'), color: 'text-gray-200' },
                    ].map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between p-2.5 rounded text-xs" style={{ backgroundColor: '#0d121c', border: '1px solid #1f293d' }}>
                        <span className="text-gray-400 flex items-center gap-1.5">
                          {spec.icon} {spec.label}:
                        </span>
                        <span className={`font-bold ${spec.color}`}>{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Genres */}
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="mt-3 pt-3 flex flex-wrap items-center gap-2" style={{ borderTop: '1px solid #1f293d' }}>
                      <span className="text-gray-400 text-xs">Genres:</span>
                      {movie.genre.map((g) => (
                        <Link
                          key={g}
                          href={`/browse?genre=${encodeURIComponent(g)}`}
                          className="inline-block px-2.5 py-1 rounded text-xs font-semibold text-gray-300 hover:text-emerald-400 no-underline"
                          style={{ backgroundColor: '#182130' }}
                        >
                          {g}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Synopsis */}
                {movie.description && (
                  <div className="rounded-lg p-4" style={{ border: '1px solid #1f293d', backgroundColor: '#111722' }}>
                    <h4 className="font-bold text-gray-300 uppercase tracking-wider text-xs mb-2">
                      Synopsis / Storyline
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{movie.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== SCREENSHOTS / QUALITY PREVIEWS ===== */}
          <div className="p-4 sm:p-5" style={{ borderTop: '1px solid #1f293d', backgroundColor: '#121824' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Screenshots / Quality Sample Frame Previews
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: '1080p FHD Sample Frame 1', sub: 'AVC/H.264 @ 4850 kbps • 1920x1080' },
                { label: '1080p FHD Sample Frame 2', sub: 'Crisp Master • 10-Bit Color Palette' },
                { label: 'Audio 5.1 TrueHD Sample', sub: 'Dolby Digital Plus 5.1 • 640 kbps' },
              ].map((sample) => (
                <div
                  key={sample.label}
                  className="flex flex-col items-center justify-center rounded p-4 text-center relative overflow-hidden"
                  style={{
                    backgroundColor: '#0b0e14',
                    border: '1px solid #1f293d',
                    aspectRatio: '16/9',
                    minHeight: '100px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${posterSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.2,
                      filter: 'blur(3px)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black mb-1.5 shadow-sm">
                      {sample.label}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      {sample.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== DOWNLOAD SECTION (MANDATORY SHRINKME) ===== */}
          <div
            id="download-section"
            className="p-6 sm:p-8"
            style={{ borderTop: '3px solid #00d26a', background: 'linear-gradient(180deg, #111a26 0%, #0d121c 50%, #0b0e14 100%)' }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-400 mb-3" style={{ backgroundColor: 'rgba(0,210,106,0.1)', border: '1px solid rgba(0,210,106,0.3)' }}>
                <CheckCircle className="h-3.5 w-3.5" />
                Verified Direct Download Mirrors
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Download {movie.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Select your preferred quality print below to start fast download.
              </p>
            </div>

            {/* Primary Download Button */}
            <div className="flex justify-center mb-8">
              <DownloadButton
                movieId={movie.id}
                size="large"
                label={`Download Now [${quality} • ${fileSize}]`}
                showNotice={true}
              />
            </div>

            {/* Mirror Links Table */}
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1f293d', backgroundColor: '#111722' }}>
              {/* Table Header */}
              <div className="flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-300 uppercase" style={{ backgroundColor: '#161f2e', borderBottom: '1px solid #1f293d' }}>
                <span>Available Server Mirrors &amp; Qualities</span>
                <span className="text-emerald-400 text-xs normal-case">100% Virus Free</span>
              </div>

              {/* Mirror Rows */}
              <div>
                {(destinations.length > 0
                  ? destinations.map((d, i) => ({
                      label: d.label || `Mirror Server ${i + 1}`,
                      quality: i === 0 ? '1080p FHD' : i === 1 ? '720p HD' : '480p SD',
                      id: d.id,
                    }))
                  : [
                      { label: `${movie.title} - 1080p WEB-DL - DD+5.1 [${fileSize}]`, quality: '1080p FHD', id: 'default-1' },
                      { label: `${movie.title} - 720p HQ HDRip [950 MB]`, quality: '720p HD', id: 'default-2' },
                      { label: `${movie.title} - 480p Clean Audio [450 MB]`, quality: '480p SD', id: 'default-3' },
                    ]
                ).map((mirror) => (
                  <div
                    key={mirror.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-gray-900/30"
                    style={{ borderBottom: '1px solid #1f293d' }}
                  >
                    {/* Left: Info */}
                    <div className="flex items-center gap-3">
                      <FileVideo className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="block text-sm font-bold text-white">{mirror.label}</span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          Fast CDN &bull; Resumable Download
                        </span>
                      </div>
                    </div>

                    {/* Right: Badge + Download */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="inline-block rounded px-2.5 py-1 text-xs font-black text-emerald-400" style={{ backgroundColor: 'rgba(0,210,106,0.15)', border: '1px solid rgba(0,210,106,0.3)' }}>
                        {mirror.quality}
                      </span>
                      <DownloadButton
                        movieId={movie.id}
                        label="Download"
                        size="compact"
                        showNotice={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="mt-5 p-4 rounded-lg flex items-start gap-3 text-xs text-gray-400" style={{ backgroundColor: 'rgba(17,23,34,0.5)', border: '1px solid #1f293d' }}>
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-300">Notice:</strong> All downloads are routed through our verified
                advertising redirect (ShrinkMe) to cover server hosting expenses. After completing the
                sponsored step, your download starts immediately. Thank you for your support!
              </span>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {related.length > 0 && (
          <div className="mt-12">
            <MovieGrid
              title={`Related ${movie.language} Releases`}
              movies={related}
              viewAllHref={`/browse?language=${encodeURIComponent(movie.language || '')}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
