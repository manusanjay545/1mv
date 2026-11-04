'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import type { Movie } from '@/types';

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        ...(search ? { search } : {}),
      });

      const res = await fetch(`/api/movies?${q.toString()}`);
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setMovies(data.data);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Fetch admin movies error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/movies/${slug}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.slug !== slug));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        alert('Failed to delete movie');
      }
    } catch (err) {
      alert('Delete request failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Movie Catalogue
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage metadata, edit download mirrors, and view catalogue entries ({total} total)
          </p>
        </div>

        <Link
          href="/admin/movies/new"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-950 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Movie</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by title, actor or keyword..."
          className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-500 outline-none focus:border-rose-500"
        />
        <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-gray-500" />
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading movie records...</div>
        ) : movies.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No movies found. Click &quot;Add New Movie&quot; or run the Auto Sync engine.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-800 bg-gray-900/60 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Quality</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-gray-300">
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-900/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.poster_url || '/placeholder-poster.svg'}
                          alt={m.title}
                          className="h-10 w-7 rounded object-cover bg-gray-800 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">{m.title}</span>
                          <span className="text-[10px] text-gray-500">{m.category || 'Movie'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-300">
                        {m.language || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{m.release_year || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="text-amber-400 font-mono text-[11px]">
                        {m.quality || 'HDRip'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-500" />
                        {m.view_count.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/movie/${m.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800"
                          title="View on site"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/movies/${m.slug}/edit`}
                          className="p-1.5 text-blue-400 hover:text-blue-300 rounded hover:bg-blue-950/20"
                          title="Edit movie"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(m.slug, m.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/20"
                          title="Delete movie"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-800/80 p-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

