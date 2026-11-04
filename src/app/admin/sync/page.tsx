'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  Loader2,
  Radio,
  FileText,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import { formatDate } from '@/lib/utils';
import type { SyncSettings, SyncLog } from '@/types';

export default function AdminSyncPage() {
  const [settings, setSettings] = useState<SyncSettings | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    source_name: 'Authorized Content Partner',
    source_url: 'https://example.com/api/movies',
    feed_url: '',
    auth_credentials: '',
    sync_interval_minutes: 15,
    is_enabled: true,
  });

  const loadData = async () => {
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/sync/settings', { headers: getAuthHeaders() }),
        fetch('/api/sync/logs?pageSize=20', { headers: getAuthHeaders() }),
      ]);

      if (settingsRes.ok) {
        const s = await settingsRes.json();
        if (s && s.id) {
          setSettings(s);
          setFormData({
            source_name: s.source_name || '',
            source_url: s.source_url || '',
            feed_url: s.feed_url || '',
            auth_credentials: s.auth_credentials || '',
            sync_interval_minutes: s.sync_interval_minutes || 15,
            is_enabled: s.is_enabled ?? true,
          });
        }
      }

      if (logsRes.ok) {
        const l = await logsRes.json();
        if (l && Array.isArray(l.data)) {
          setLogs(l.data);
        }
      }
    } catch (err) {
      console.error('Fetch sync data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/sync/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ text: 'Sync settings updated successfully!', type: 'success' });
        loadData();
      } else {
        const d = await res.json();
        setMessage({ text: d.error || 'Failed to update settings', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

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
          text: `Manual sync completed: ${data.newRecords || 0} new, ${data.updatedRecords || 0} updated.`,
          type: 'success',
        });
        loadData();
      } else {
        setMessage({
          text: `Sync note: ${data.errorMessage || data.error || 'Check endpoint configuration'}`,
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

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Automated Content Synchronization
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure automated 15-minute background sync from authorized RSS or JSON feeds
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-950 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronizing Source...' : 'Trigger Sync Now'}</span>
        </button>
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

      {/* Sync Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Radio className="h-4 w-4 text-rose-500" />
            <span>Sync Engine State</span>
          </div>
          <span
            className={`inline-block text-base font-bold ${
              formData.is_enabled ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {formData.is_enabled ? 'Active (Auto 15m)' : 'Paused'}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>Last Sync</span>
          </div>
          <span className="text-sm font-semibold text-white block">
            {settings?.last_sync_at ? formatDate(settings.last_sync_at) : 'Never'}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Next Scheduled Run</span>
          </div>
          <span className="text-sm font-semibold text-white block">
            {settings?.next_sync_at ? formatDate(settings.next_sync_at) : 'Cron every 15 min'}
          </span>
        </div>
      </div>

      {/* Sync Settings Form */}
      <form onSubmit={handleSaveSettings} className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Feed & Source Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1.5 font-medium">Source Name</label>
            <input
              type="text"
              value={formData.source_name}
              onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1.5 font-medium">
              Sync Cadence (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={1440}
              value={formData.sync_interval_minutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sync_interval_minutes: parseInt(e.target.value, 10) || 15,
                })
              }
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400 block mb-1.5 font-medium">
              RSS Feed URL (Preferred for 15-minute auto discovery)
            </label>
            <input
              type="url"
              value={formData.feed_url}
              onChange={(e) => setFormData({ ...formData, feed_url: e.target.value })}
              placeholder="https://authorized-source.com/rss.xml"
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400 block mb-1.5 font-medium">
              JSON API Endpoint (Alternative to RSS)
            </label>
            <input
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              placeholder="https://authorized-source.com/api/movies"
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-gray-400 block mb-1.5 font-medium">
              API Authentication Bearer / Header (Optional)
            </label>
            <input
              type="password"
              value={formData.auth_credentials}
              onChange={(e) => setFormData({ ...formData, auth_credentials: e.target.value })}
              placeholder="Bearer token or authorization header..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="enable-sync"
              checked={formData.is_enabled}
              onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
              className="h-4 w-4 rounded accent-rose-600"
            />
            <label htmlFor="enable-sync" className="text-xs text-gray-300 font-medium cursor-pointer">
              Enable scheduled synchronization (Every {formData.sync_interval_minutes} minutes via Vercel Cron)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-800 hover:bg-gray-700 px-5 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          <span>Save Settings</span>
        </button>
      </form>

      {/* Sync Execution History */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-rose-500" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Sync Execution Logs ({logs.length})
            </h2>
          </div>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No synchronization history recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Run Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">New Titles</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3">Skipped</th>
                  <th className="py-2.5 px-3">Diagnostic Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-gray-300">
                {logs.map((log) => (
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
                    <td className="py-3 px-3 text-gray-400 max-w-sm truncate font-mono text-[11px]">
                      {log.error_message || 'OK — sync completed successfully'}
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

