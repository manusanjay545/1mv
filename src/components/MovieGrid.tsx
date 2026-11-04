import Link from 'next/link';
import { ChevronRight, Film } from 'lucide-react';
import type { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  icon?: React.ReactNode;
}

export default function MovieGrid({
  movies,
  title,
  subtitle,
  viewAllHref,
  icon,
}: MovieGridProps) {
  return (
    <section className="w-full">
      {title && (
        <div className="mb-3 flex items-center justify-between border-b border-[#1f293d] pb-2">
          <div className="flex items-center gap-2">
            {icon ? (
              icon
            ) : (
              <Film className="h-4 w-4 text-emerald-400" />
            )}
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                {title}
                <span className="text-[10px] font-semibold text-gray-500 lowercase">
                  ({movies.length} items)
                </span>
              </h2>
              {subtitle && (
                <p className="text-[11px] text-gray-400 -mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-0.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-tight"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
