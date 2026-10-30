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
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 ${
          large ? 'h-5 w-5' : 'h-4 w-4'
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-full border border-gray-700 bg-gray-800/80 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 ${
          large ? 'py-4 pl-12 pr-6 text-base' : 'py-2.5 pl-10 pr-4 text-sm'
        }`}
      />
    </form>
  );
}
