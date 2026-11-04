'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Save } from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import { LANGUAGES, GENRES, CATEGORIES } from '@/types';
import { slugify } from '@/lib/utils';

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    release_year: new Date().getFullYear(),
    language: 'Tamil',
    genre: ['Action'] as string[],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.4 GB',
    source_url: '',
    is_web_series: false,
  });

  const [destinations, setDestinations] = useState<
    { label: string; original_url: string }[]
  >([
    { label: 'Download 1080p [2.4 GB]', original_url: 'https://archive.org/download/sample' },
  ]);

  const handleAddDestination = () => {
    setDestinations((prev) => [
      ...prev,
      { label: `Download Quality [${prev.length + 1}]`, original_url: '' },
    ]);
  };

  const handleRemoveDestination = (idx: number) => {
    setDestinations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenreToggle = (g: string) => {
    setFormData((prev) => {
      const exists = prev.genre.includes(g);
      return {
        ...prev,
        genre: exists ? prev.genre.filter((item) => item !== g) : [...prev.genre, g],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const slug = slugify(formData.title);

      // 1. Create Movie
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      const movieData = await res.json();
      if (!res.ok) {
        throw new Error(movieData.error || 'Failed to create movie');
      }

      const movieId = movieData.id;

      // 2. Insert destinations
      if (movieId && destinations.length > 0) {
        for (const dest of destinations) {
          if (dest.original_url.trim()) {
            await fetch('/api/destinations', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                movieId,
                label: dest.label,
                originalUrl: dest.original_url,
              }),
            });
          }
        }
      }

      router.push('/admin/movies');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/movies"
          className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Add New Movie</h1>
          <p className="text-xs text-gray-400">Manual metadata entry and mirror destination setup</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-gray-400 block mb-1.5 font-medium">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Leo: Bloody Sweet (2024)"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    is_web_series: e.target.value === 'Web Series',
                  })
                }
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Release Year</label>
              <input
                type="number"
                value={formData.release_year}
                onChange={(e) =>
                  setFormData({ ...formData, release_year: parseInt(e.target.value, 10) })
                }
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Quality Print</label>
              <input
                type="text"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                placeholder="1080p HQ / 4K UHD"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">File Size</label>
              <input
                type="text"
                value={formData.file_size}
                onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                placeholder="2.4 GB"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Poster URL</label>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-400 block mb-1.5 font-medium">Description / Synopsis</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief plot synopsis..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-2 font-medium">Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => {
                const active = formData.genre.includes(g);
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenreToggle(g)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Destinations / Download Mirrors */}
        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Download Destinations & Mirrors
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Each destination is served via ShrinkMe monetization link
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDestination}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-rose-400 hover:bg-gray-900"
            >
              <Plus className="h-3 w-3" />
              <span>Add Mirror</span>
            </button>
          </div>

          <div className="space-y-3">
            {destinations.map((dest, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-950"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={dest.label}
                    onChange={(e) => {
                      const updated = [...destinations];
                      updated[idx].label = e.target.value;
                      setDestinations(updated);
                    }}
                    placeholder="Mirror Label (e.g. 1080p Fast Mirror)"
                    className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="url"
                    value={dest.original_url}
                    onChange={(e) => {
                      const updated = [...destinations];
                      updated[idx].original_url = e.target.value;
                      setDestinations(updated);
                    }}
                    placeholder="https://authorized-destination-link..."
                    className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white outline-none"
                  />
                </div>
                {destinations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(idx)}
                    className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Movie...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save & Publish Movie</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

