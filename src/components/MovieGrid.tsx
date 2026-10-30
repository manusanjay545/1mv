import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  viewAllHref?: string;
}

export default function MovieGrid({ movies, title, viewAllHref }: MovieGridProps) {
  return (
    <section>
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
