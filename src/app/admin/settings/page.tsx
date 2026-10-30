'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  ShieldAlert,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
  DollarSign,
  Globe,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    shrinkme_url: 'https://shrinkme.click/OXfgZ7I',
    monetization_enabled: true,
    site_name: 'MovieVault',
    site_description: 'Comprehensive South Indian and Bollywood movie directory with fast downloads.',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.shrinkme_url) {
          setFormData({
            shrinkme_url: data.shrinkme_url || 'https://shrinkme.click/OXfgZ7I',
            monetization_enabled: data.monetization_enabled ?? true,
            site_name: data.site_name || 'MovieVault',
            site_description: data.site_description || '',
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch settings error:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ text: 'Settings updated successfully!', type: 'success' });
      } else {
        const d = await res.json();
        setMessage({ text: d.error || 'Failed to update settings', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestDownload = () => {
    window.open(formData.shrinkme_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Monetization & Site Configuration
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage the central ShrinkMe URL, monetization switch and catalogue branding
        </p>
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

      {/* ShrinkMe Monetization Box */}
      <div className="rounded-2xl border-2 border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-gray-900/60 to-gray-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <DollarSign className="h-4 w-4" />
          <span>ShrinkMe.io Mandatory Integration</span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          The application uses the centralized fixed link below for every download button on movie detail
          and series pages. Outbound clicks are tracked in your Supabase analytics.
        </p>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5 uppercase">
            Configured ShrinkMe Target
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              readOnly
              value={formData.shrinkme_url}
              className="flex-1 rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white font-mono outline-none"
            />
            <button
              type="button"
              onClick={handleTestDownload}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 hover:bg-gray-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              <span>Test Download Button</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="monetization-toggle"
            checked={formData.monetization_enabled}
            onChange={(e) =>
              setFormData({ ...formData, monetization_enabled: e.target.checked })
            }
            className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
          />
          <label
            htmlFor="monetization-toggle"
            className="text-xs text-gray-300 font-medium cursor-pointer"
          >
            Enable Monetization (When unchecked, download buttons route directly to original destination links)
          </label>
        </div>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSave} className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Catalogue Information
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1.5 font-medium">Site Name</label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1.5 font-medium">Meta Description</label>
            <textarea
              rows={3}
              value={formData.site_description}
              onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
              className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-950 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
}
