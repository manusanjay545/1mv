'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  MousePointer,
  Calendar,
  TrendingUp,
  ExternalLink,
  Film,
  Sparkles,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';

interface AnalyticsData {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  topMovies: {
    movieId: string;
    title: string;
    slug: string;
    posterUrl: string | null;
    clicks: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalClicks: 0,
    clicksToday: 0,
    clicksThisWeek: 0,
    topMovies: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/stats', { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((resData) => {
        if (resData && typeof resData.totalClicks === 'number') {
          setData(resData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Analytics stats fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Click Analytics & Monetization
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor outbound ShrinkMe download button clicks and high-performing titles
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="uppercase tracking-wider font-semibold">Total Clicks</span>
            <MousePointer className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {data.totalClicks.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">
            All-time ShrinkMe redirect events
          </span>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="uppercase tracking-wider font-semibold">Clicks Today</span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {data.clicksToday.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
            Active visitor conversions
          </span>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="uppercase tracking-wider font-semibold">Last 7 Days</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {data.clicksThisWeek.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Rolling weekly volume
          </span>
        </div>
      </div>

      {/* Top Titles by Click Performance */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-rose-500" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Top Performing Titles
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading click metrics...</div>
        ) : data.topMovies.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No click events recorded yet. Clicks will appear here once visitors start downloading titles.
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {data.topMovies.map((item, idx) => (
              <div
                key={item.movieId}
                className="flex items-center justify-between py-3.5 hover:bg-gray-900/60 text-xs px-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono w-5 text-center">#{idx + 1}</span>
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="h-10 w-7 rounded object-cover bg-gray-800 shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-7 rounded bg-gray-800 flex items-center justify-center text-gray-600 shrink-0">
                      <Film className="h-3 w-3" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-white block">{item.title}</span>
                    <Link
                      href={`/movie/${item.slug}`}
                      target="_blank"
                      className="text-[10px] text-gray-500 hover:text-gray-300 inline-flex items-center gap-1"
                    >
                      <span>View details</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-rose-400 block">
                    {item.clicks.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500">downloads</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
