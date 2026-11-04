'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Download, HardDrive } from 'lucide-react';
import type { Movie } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterSrc = movie.poster_url || '/placeholder-poster.svg';
  const quality = movie.quality || '1080p HD';
  const fileSize = movie.file_size || '1.4 GB';

  const qualityColor =
    quality.includes('4K') || quality.includes('2160')
      ? { bg: '#f59e0b', color: '#000' }
      : quality.includes('1080')
      ? { bg: '#00d26a', color: '#000' }
      : quality.includes('720')
      ? { bg: '#2563eb', color: '#fff' }
      : { bg: '#dc2626', color: '#fff' };

  return (
    <Link href={`/movie/${movie.slug}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#111722',
          border: '1px solid #1f293d',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,210,106,0.5)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#1f293d';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Poster */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', overflow: 'hidden', backgroundColor: '#0b0e14' }}>
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
            className="object-cover"
            unoptimized
            style={{ transition: 'transform 0.3s' }}
          />

          {/* Quality Badge */}
          <span style={{
            position: 'absolute', top: '6px', left: '6px',
            borderRadius: '4px', padding: '2px 6px',
            fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.02em',
            backgroundColor: qualityColor.bg, color: qualityColor.color,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            {quality}
          </span>

          {/* Language / Series Badge */}
          {movie.is_web_series ? (
            <span style={{ position: 'absolute', top: '6px', right: '6px', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', backgroundColor: '#7c3aed', color: '#fff' }}>
              SERIES
            </span>
          ) : movie.language ? (
            <span style={{ position: 'absolute', top: '6px', right: '6px', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.8)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.1)' }}>
              {movie.language}
            </span>
          ) : null}

          {/* File Size Badge */}
          {fileSize && (
            <div style={{ position: 'absolute', bottom: '6px', right: '6px', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.85)', color: '#00d26a', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(0,210,106,0.3)' }}>
              <HardDrive style={{ width: '10px', height: '10px' }} />
              {fileSize}
            </div>
          )}

          {/* Bottom gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #111722)', pointerEvents: 'none' }} />
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '10px', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.3, color: '#f3f4f6', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {movie.title}
            </h3>
            <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9ca3af' }}>
              {movie.release_year && (
                <span style={{ fontWeight: 600, color: '#fbbf24' }}>({movie.release_year})</span>
              )}
              {movie.genre && movie.genre.length > 0 && (
                <span style={{ color: '#9ca3af' }}>• {movie.genre[0]}</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1f293d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af' }}>
              <Calendar style={{ width: '12px', height: '12px', color: '#6b7280' }} />
              {movie.published_at ? formatRelativeTime(movie.published_at) : 'Recent'}
            </span>
            <span style={{ color: '#00d26a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Download style={{ width: '12px', height: '12px' }} />
              Get
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
