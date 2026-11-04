'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  large?: boolean;
}

export default function SearchBar({
  placeholder = 'Search movies, series, genres...',
  className = '',
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Search
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 ${
          large ? 'h-5 w-5' : 'h-4 w-4'
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-[#1f293d] bg-[#111722] text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 ${
          large ? 'py-3.5 pl-11 pr-24 text-sm' : 'py-2 pl-9 pr-16 text-xs'
        }`}
      />
      <button
        type="submit"
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-black transition-colors ${
          large ? 'px-4 py-2 text-xs' : 'px-2.5 py-1 text-[11px]'
        }`}
      >
        Search
      </button>
    </form>
  );
}
