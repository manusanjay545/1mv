'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2 } from 'lucide-react';
import { getAuthHeaders } from '@/lib/admin-auth';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    try {
      const slug = slugify(name);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: name.trim(), slug }),
      });

      if (res.ok) {
        setName('');
        fetchCategories();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to add category');
      }
    } catch (err) {
      alert('Error creating category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Categories Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage catalogue sections, classification labels and taxonomy
        </p>
      </div>

      {/* Add Category Form */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 p-6">
        <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Create New Category
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name (e.g. Anime, Documentary, Short Film)"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-950 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* List Categories */}
      <div className="rounded-2xl border border-gray-900 bg-gray-900/40 overflow-hidden">
        <div className="p-4 border-b border-gray-800/80">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Existing Categories ({categories.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading categories...</div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 hover:bg-gray-900/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-rose-500">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{cat.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">slug: {cat.slug}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
