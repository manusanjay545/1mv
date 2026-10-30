'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Film } from 'lucide-react';
import type { Movie } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const genres = movie.genre?.slice(0, 2) ?? [];
  const posterSrc = movie.poster_url || '/placeholder-poster.svg';

  return (
    <Link href={`/movie/${movie.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-800 transition-all duration-300 group-hover:ring-accent/50 group-hover:scale-[1.03]">
        {/* Poster */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Quality badge */}
          {movie.quality && (
            <span className="absolute top-2 left-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-lg">
              {movie.quality}
            </span>
          )}

          {/* Category badge */}
          {movie.is_web_series && (
            <span className="absolute top-2 right-2 flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-lg">
              <Film className="h-2.5 w-2.5" />
              Series
            </span>
          )}

          {/* Hover info overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {/* Genre badges */}
            {genres.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-gray-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {movie.published_at && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(movie.published_at)}
              </div>
            )}
          </div>
        </div>

        {/* Card bottom info */}
        <div className="p-2.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-100 transition-colors group-hover:text-accent">
            {movie.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            {movie.release_year && (
              <span className="text-xs text-gray-500">{movie.release_year}</span>
            )}
            {movie.language && (
              <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                {movie.language}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
