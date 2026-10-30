'use client';

import { useState } from 'react';
import { Download, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';

interface DownloadButtonProps {
  movieId?: string;
  destinationId?: string;
  originalUrl?: string;
  label?: string;
  size?: 'normal' | 'large';
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
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const isLarge = size === 'large';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl font-semibold text-white transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-70 ${
          isLarge
            ? 'w-full max-w-md px-8 py-4 text-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 shadow-red-900/40 hover:shadow-red-600/50 hover:scale-[1.02]'
            : 'px-5 py-2.5 text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-900/30 hover:scale-[1.02]'
        }`}
      >
        {/* Glow effect */}
        <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

        {loading ? (
          <>
            <Loader2 className={`${isLarge ? 'h-6 w-6' : 'h-4 w-4'} animate-spin`} />
            <span>Redirecting...</span>
          </>
        ) : (
          <>
            <Download className={`${isLarge ? 'h-6 w-6' : 'h-4 w-4'} transition-transform group-hover:translate-y-0.5`} />
            <span>{label}</span>
            <ExternalLink className={`${isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} opacity-70`} />
          </>
        )}
      </button>

      {showNotice && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Sponsored link: You will be redirected via our partner{' '}
            <span className="text-gray-300 font-medium">ShrinkMe</span> to support free hosting.
          </span>
        </div>
      )}
    </div>
  );
}
