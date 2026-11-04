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
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://shrinkme.click/OXfgZ7I', '_blank', 'noopener,noreferrer');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  // COMPACT: small inline button
  if (size === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '6px',
          backgroundColor: '#00d26a',
          color: '#000',
          fontWeight: 800,
          fontSize: '12px',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
        ) : (
          <Download style={{ width: 14, height: 14 }} />
        )}
        <span>{label}</span>
      </button>
    );
  }

  // NORMAL or LARGE
  const isLarge = size === 'large';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isLarge ? '100%' : 'auto', maxWidth: isLarge ? '420px' : 'none' }} className={className}>
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: isLarge ? '100%' : 'auto',
          padding: isLarge ? '16px 32px' : '10px 20px',
          borderRadius: '10px',
          backgroundColor: '#00d26a',
          color: '#000',
          fontWeight: 900,
          fontSize: isLarge ? '16px' : '13px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,210,106,0.25)',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#00e676';
          (e.target as HTMLElement).style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#00d26a';
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {loading ? (
          <>
            <Loader2 style={{ width: isLarge ? 24 : 16, height: isLarge ? 24 : 16, animation: 'spin 1s linear infinite' }} />
            <span>Generating Link...</span>
          </>
        ) : (
          <>
            <Download style={{ width: isLarge ? 24 : 16, height: isLarge ? 24 : 16 }} />
            <span>{label}</span>
            <ExternalLink style={{ width: isLarge ? 16 : 14, height: isLarge ? 16 : 14, opacity: 0.7 }} />
          </>
        )}
      </button>

      {showNotice && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
          <ShieldCheck style={{ width: 14, height: 14, color: '#00d26a', flexShrink: 0 }} />
          <span>
            Sponsored Fast Download: Protected via{' '}
            <strong style={{ color: '#00d26a' }}>ShrinkMe</strong> to support our servers.
          </span>
        </div>
      )}
    </div>
  );
}
