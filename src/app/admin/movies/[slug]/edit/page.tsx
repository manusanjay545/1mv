'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Save } from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import { LANGUAGES, GENRES, CATEGORIES, type Movie, type Destination } from '@/types';

interface EditMoviePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditMoviePage({ params }: EditMoviePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    release_year: 2024,
    language: 'Tamil',
    genre: [] as string[],
    category: 'Movie',
    quality: '1080p HQ',
    file_size: '2.4 GB',
    is_web_series: false,
  });

  const [destinations, setDestinations] = useState<
    { id?: string; label: string; original_url: string }[]
  >([]);

  useEffect(() => {
    fetch(`/api/movies/${slug}`)
      .then((res) => res.json())
      .then((data: Movie & { destinations?: Destination[] }) => {
        if (data && data.title) {
          setFormData({
            title: data.title,
            description: data.description || '',
            poster_url: data.poster_url || '',
            release_year: data.release_year || 2024,
            language: data.language || 'Tamil',
            genre: data.genre || [],
            category: data.category || 'Movie',
            quality: data.quality || '1080p HQ',
            file_size: data.file_size || '2.4 GB',
            is_web_series: data.is_web_series || false,
          });

          if (data.destinations && data.destinations.length > 0) {
            setDestinations(
              data.destinations.map((d) => ({
                id: d.id,
                label: d.label || 'Download',
                original_url: d.original_url,
              }))
            );
          }
        }
        setFetching(false);
      })
      .catch((err) => {
        setError('Failed to fetch movie');
        setFetching(false);
      });
  }, [slug]);

  const handleAddDestination = () => {
    setDestinations((prev) => [
      ...prev,
      { label: `Download Mirror [${prev.length + 1}]`, original_url: '' },
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
      // 1. Update Movie
      const res = await fetch(`/api/movies/${slug}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.error || 'Failed to update movie');
      }

      router.push('/admin/movies');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading movie details...</div>;
  }

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Movie</h1>
          <p className="text-xs text-gray-400">Editing &quot;{formData.title}&quot;</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-gray-400 block mb-1.5 font-medium">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">File Size</label>
              <input
                type="text"
                value={formData.file_size}
                onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Poster URL</label>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-400 block mb-1.5 font-medium">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Update Movie</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

