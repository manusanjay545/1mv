'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Film, Eye, Download, HardDrive, Calendar } from 'lucide-react';
import type { Movie } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
}

export default function MovieCard({ movie, compact = false }: MovieCardProps) {
  const posterSrc = movie.poster_url || '/placeholder-poster.svg';
  const quality = movie.quality || '1080p HD';
  const fileSize = movie.file_size || '1.4 GB';

  return (
    <Link href={`/movie/${movie.slug}`} className="group block h-full">
      <div className="relative flex flex-col h-full overflow-hidden rounded-lg bg-[#111722] border border-[#1f293d] hover:border-emerald-500/60 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-emerald-950/20">
        {/* Poster Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0b0e14]">
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />

          {/* Top Badges */}
          <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none gap-1">
            {/* Quality Badge */}
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tight shadow-md ${
                quality.includes('4K') || quality.includes('2160')
                  ? 'bg-amber-500 text-black'
                  : quality.includes('1080')
                  ? 'bg-emerald-500 text-black'
                  : quality.includes('720')
                  ? 'bg-blue-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {quality}
            </span>

            {/* Language / Series badge */}
            {movie.is_web_series ? (
              <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-md">
                SERIES
              </span>
            ) : movie.language ? (
              <span className="rounded bg-black/80 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 text-[10px] font-bold text-gray-200">
                {movie.language}
              </span>
            ) : null}
          </div>

          {/* File Size Badge on bottom-right of poster */}
          {fileSize && (
            <div className="absolute bottom-1.5 right-1.5 rounded bg-black/85 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
              <HardDrive className="h-2.5 w-2.5" />
              <span>{fileSize}</span>
            </div>
          )}

          {/* Dark gradient on bottom of poster */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#111722] to-transparent pointer-events-none" />
        </div>

        {/* Content Box */}
        <div className="flex flex-col flex-1 p-2.5 justify-between">
          <div>
            <h3 className="line-clamp-2 text-xs font-bold leading-tight text-gray-100 group-hover:text-emerald-400 transition-colors">
              {movie.title}
            </h3>

            {/* Sub-info: Year & Genre */}
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
              {movie.release_year && (
                <span className="font-semibold text-amber-400">({movie.release_year})</span>
              )}
              {movie.genre && movie.genre.length > 0 && (
                <span className="truncate text-gray-400">&bull; {movie.genre[0]}</span>
              )}
            </div>
          </div>

          {/* Footer Bar: Time / Views & Download Action */}
          <div className="mt-2.5 pt-2 border-t border-[#1f293d] flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar className="h-3 w-3 text-gray-500" />
              {movie.published_at ? formatRelativeTime(movie.published_at) : 'Recent'}
            </span>

            <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-0.5">
              <Download className="h-3 w-3" />
              <span>Get</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
