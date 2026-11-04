'use client';

import { useState } from 'react';
import { Download, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';

interface DownloadButtonProps {
  movieId?: string;
  destinationId?: string;
  originalUrl?: string;
  label?: string;
  size?: 'compact' | 'normal' | 'large';
  className?: string;
  showNotice?: boolean;
}

export default function DownloadButton({
  movieId,
  destinationId,
  originalUrl,
  label = 'Download Now',
  size = 'normal',
  className = '',
  showNotice = true,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          destinationId,
          originalUrl,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      });

      const data = await res.json();
      const targetUrl = data.shrinkmeUrl || 'https://shrinkme.click/OXfgZ7I';

      // Open ShrinkMe advertising link in a new tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Download click error:', err);
      // Fallback directly to the required ShrinkMe URL
      window.open('https://shrinkme.click/OXfgZ7I', '_blank', 'noopener,noreferrer');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  if (size === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-transform active:scale-95 disabled:opacity-60 shadow-sm ${className}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        <span>{label}</span>
      </button>
    );
  }

  const isLarge = size === 'large';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg font-black transition-all duration-200 active:scale-95 disabled:opacity-70 shadow-lg ${
          isLarge
            ? 'w-full max-w-md px-8 py-4 text-base sm:text-lg bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950/40 hover:shadow-emerald-600/50 hover:scale-[1.01]'
            : 'px-5 py-2.5 text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950/30'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className={`${isLarge ? 'h-6 w-6' : 'h-4 w-4'} animate-spin`} />
            <span>Generating Link...</span>
          </>
        ) : (
          <>
            <Download
              className={`${
                isLarge ? 'h-6 w-6' : 'h-4 w-4'
              } transition-transform group-hover:translate-y-0.5`}
            />
            <span>{label}</span>
            <ExternalLink
              className={`${isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} opacity-75`}
            />
          </>
        )}
      </button>

      {showNotice && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Sponsored Fast Download: Protected via{' '}
            <strong className="text-emerald-400">ShrinkMe</strong> to support our servers.
          </span>
        </div>
      )}
    </div>
  );
}
