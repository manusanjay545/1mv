'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Film,
  Download,
  Calendar,
  HardDrive,
  Sparkles,
  Flame,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import type { Movie } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import DownloadButton from '@/components/DownloadButton';

interface DirectoryTableProps {
  movies: Movie[];
}

export default function DirectoryTable({ movies }: DirectoryTableProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredMovies =
    activeTab === 'all'
      ? movies
      : activeTab === 'series'
      ? movies.filter((m) => m.is_web_series)
      : movies.filter(
          (m) => m.language?.toLowerCase() === activeTab.toLowerCase()
        );

  const tabs = [
    { id: 'all', label: 'All Releases' },
    { id: 'tamil', label: 'Tamil' },
    { id: 'telugu', label: 'Telugu' },
    { id: 'malayalam', label: 'Malayalam' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'series', label: 'Web Series' },
  ];

  return (
    <div className="w-full rounded-lg border border-[#1f293d] bg-[#0d121c] overflow-hidden shadow-xl">
      {/* Table Header / Category Bar */}
      <div className="border-b border-[#1f293d] bg-[#121824] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <span>Live Sync Catalogue Directory</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              UPDATED 15m
            </span>
          </h2>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'bg-[#182130] text-gray-400 hover:text-white hover:bg-[#1f293d]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Rows */}
      <div className="divide-y divide-[#1f293d]">
        {filteredMovies.slice(0, 15).map((movie, index) => {
          const quality = movie.quality || '1080p HQ';
          const size = movie.file_size || '1.4 GB';
          const poster = movie.poster_url || '/placeholder-poster.svg';

          return (
            <div
              key={movie.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 hover:bg-[#121824] transition-colors gap-3"
            >
              {/* Left: Thumbnail & Title String */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Micro Thumbnail */}
                <Link
                  href={`/movie/${movie.slug}`}
                  className="relative h-14 w-10 sm:h-16 sm:w-11 shrink-0 overflow-hidden rounded bg-[#1f293d] border border-[#2d3b55] group-hover:border-emerald-500/50"
                >
                  <Image
                    src={poster}
                    alt={movie.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                    unoptimized
                  />
                </Link>

                {/* Title & Metadata Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {/* Language tag */}
                    {movie.language && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/80 border border-white/10 text-gray-300">
                        {movie.language}
                      </span>
                    )}
                    {/* Quality Tag */}
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        quality.includes('4K')
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {quality}
                    </span>
                    {movie.is_web_series && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-600/30 text-purple-300 border border-purple-500/30">
                        SERIES
                      </span>
                    )}
                    {movie.release_year && (
                      <span className="text-[10px] font-semibold text-amber-400">
                        ({movie.release_year})
                      </span>
                    )}
                  </div>

                  {/* Title Link styled like 1TamilMV forum post */}
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
                      {movie.published_at
                        ? formatRelativeTime(movie.published_at)
                        : 'Today'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <HardDrive className="h-3 w-3" />
                      {size}
                    </span>
                    {movie.genre && movie.genre[0] && (
                      <span className="hidden md:inline text-gray-400">
                        &bull; {movie.genre[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  href={`/movie/${movie.slug}`}
                  className="px-3 py-1.5 rounded bg-[#182130] hover:bg-[#1f293d] border border-[#2d3b55] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Details
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

      {/* Table Footer */}
      <div className="bg-[#121824] px-4 py-2.5 border-t border-[#1f293d] flex items-center justify-between text-xs">
        <span className="text-gray-400 text-[11px]">
          Showing {Math.min(15, filteredMovies.length)} of {filteredMovies.length} synced entries
        </span>
        <Link
          href="/browse"
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
        >
          <span>Browse All Movies & Series &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
