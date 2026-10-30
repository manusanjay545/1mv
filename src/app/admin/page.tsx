'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Plus,
  MousePointer,
  Tag,
  RefreshCw,
  Clock,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Database,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import { formatDate } from '@/lib/utils';
import type { DashboardStats, SyncLog } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    newToday: 0,
    totalClicks: 0,
    totalCategories: 6,
    lastSync: null,
    nextSync: null,
    failedSyncs: 0,
  });

  const [recentLogs, setRecentLogs] = useState<SyncLog[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Dashboard stats fetch failed:', err);
    }

    try {
      const res = await fetch('/api/sync/logs?pageSize=5', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const logsData = await res.json();
        if (logsData && Array.isArray(logsData.data)) {
          setRecentLogs(logsData.data);
        }
      }
    } catch (err) {
      console.warn('Logs fetch failed:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          text: `Sync executed: ${data.newRecords || 0} new, ${data.updatedRecords || 0} updated.`,
          type: 'success',
        });
        loadDashboardData();
      } else {
        setMessage({
          text: `Sync note: ${data.errorMessage || data.error || 'Check sync settings'}`,
          type: 'error',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync request failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setMessage(null);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          text: `Seed completed: ${data.result?.inserted || 0} sample titles inserted!`,
          type: 'success',
        });
        loadDashboardData();
      } else {
        setMessage({ text: data.error || 'Seed failed', type: 'error' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Seed request failed';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time synchronization status, catalogue metrics and monetization analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronizing...' : 'Run Sync Now'}</span>
          </button>

          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 transition-all disabled:opacity-50"
          >
            <Database className="h-3.5 w-3.5 text-amber-400" />
            <span>{seeding ? 'Seeding...' : 'Populate Demo Data'}</span>
          </button>

          <Link
            href="/admin/movies/new"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-rose-500" />
            <span>Add Movie</span>
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-950/30 border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Movies */}
        <div className="rounded-2xl border border-gray-900 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Movies
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Film className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            {stats.totalMovies.toLocaleString()}
          </p>
          <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+{stats.newToday}</span> added today
          </div>
        </div>

        {/* Total Download Clicks */}
        <div className="rounded-2xl border border-gray-900 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              ShrinkMe Clicks
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <MousePointer className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            {stats.totalClicks.toLocaleString()}
          </p>
          <div className="mt-2 text-[11px] text-gray-500">
            Monetized outbound redirects
          </div>
        </div>

        {/* Sync Status */}
        <div className="rounded-2xl border border-gray-900 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sync Cadence
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-white mt-3">
            {stats.lastSync ? formatDate(stats.lastSync) : 'Every 15 Minutes'}
          </p>
          <div className="mt-2 text-[11px] text-gray-500">
            Next scheduled: {stats.nextSync ? formatDate(stats.nextSync) : 'Configured via Cron'}
          </div>
        </div>

        {/* Failed Syncs */}
        <div className="rounded-2xl border border-gray-900 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Job Health
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                stats.failedSyncs > 0
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {stats.failedSyncs > 0 ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            {stats.failedSyncs === 0 ? 'Optimal' : `${stats.failedSyncs} Issues`}
          </p>
          <div className="mt-2 text-[11px] text-gray-500">
            {stats.failedSyncs === 0 ? 'All pipelines operational' : 'Review recent error logs'}
          </div>
        </div>
      </div>

      {/* Monetization Quick Card */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-gray-900/60 to-gray-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" />
            <span>Configured ShrinkMe URL</span>
          </div>
          <p className="font-mono text-sm text-gray-200">https://shrinkme.click/OXfgZ7I</p>
          <p className="text-xs text-gray-400 mt-1">
            Every download button on catalogue and detail pages redirects through this centralized URL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://shrinkme.click/OXfgZ7I"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <span>Test URL</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <span>Settings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Sync Logs */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recent Synchronization Jobs</h2>
          <Link href="/admin/sync" className="text-xs text-rose-400 hover:text-rose-300">
            View All Logs &rarr;
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">
            No synchronization runs logged yet. Click &quot;Run Sync Now&quot; to test your source feed.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Started At</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">New</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3">Skipped</th>
                  <th className="py-2.5 px-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-300">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-900/60">
                    <td className="py-3 px-3 font-mono text-gray-400">
                      {formatDate(log.started_at)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          log.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : log.status === 'failed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{log.new_records}</td>
                    <td className="py-3 px-3 text-blue-400">{log.updated_records}</td>
                    <td className="py-3 px-3 text-gray-500">{log.skipped_records}</td>
                    <td className="py-3 px-3 text-gray-400 max-w-xs truncate">
                      {log.error_message || 'Completed successfully'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
