'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Send,
  Shield,
  Film,
  Sparkles,
  Flame,
  Radio,
} from 'lucide-react';

const CATEGORY_TABS = [
  { label: 'HOME', href: '/', badge: null },
  { label: 'TAMIL', href: '/browse?language=Tamil', badge: 'HD' },
  { label: 'TELUGU', href: '/browse?language=Telugu', badge: 'HD' },
  { label: 'MALAYALAM', href: '/browse?language=Malayalam', badge: null },
  { label: 'KANNADA', href: '/browse?language=Kannada', badge: null },
  { label: 'HINDI', href: '/browse?language=Hindi', badge: 'HOT' },
  { label: 'ENGLISH', href: '/browse?language=English', badge: null },
  { label: 'WEB SERIES', href: '/browse?category=Web+Series', badge: 'NEW' },
  { label: 'TRENDING', href: '/browse?sort=popular', badge: 'TOP' },
  { label: 'ALL RELEASES', href: '/browse?sort=newest', badge: null },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f293d] bg-[#0b0e14]/95 backdrop-blur-md">
      {/* 1. TOP TICKER / MARQUEE BAR */}
      <div className="bg-[#121824] border-b border-[#1f293d] py-1.5 px-3 text-[11px] text-gray-300 overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#1f293d]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400 tracking-wider uppercase text-[10px]">
            AUTO SYNC 15m
          </span>
        </div>

        {/* Scrolling announcement */}
        <div className="overflow-hidden whitespace-nowrap flex-1 px-4">
          <div className="animate-marquee inline-block text-gray-300">
            <span className="mx-4 text-emerald-400 font-semibold">★ OFFICIAL CATALOGUE PORTAL ★</span>
            <span className="mx-4">Bookmark this domain: <strong className="text-white">1MovieVault</strong> • Regular 4K, 1080p, 720p HD Updates Every 15 Minutes</span>
            <span className="mx-4 text-amber-400 font-semibold">• Tamil • Telugu • Malayalam • Hindi • Kannada • English</span>
            <span className="mx-4 text-emerald-400 font-semibold">★ High Speed Direct Mirrors Available ★</span>
          </div>
        </div>

        {/* Right side links */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 pl-3 border-l border-[#1f293d]">
          <Link
            href="/admin"
            className="text-[11px] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
          >
            <Shield className="h-3 w-3 text-emerald-400" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">
          {/* Logo with 1TamilMV iconic style */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 text-white font-black text-lg shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform">
              1
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                MOVIE<span className="text-emerald-400">VAULT</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold -mt-0.5">
                HD Catalogue &bull; Fast Mirror
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, web series, year (e.g. Leo, 2024, Tamil)..."
                className="w-full h-10 rounded-lg border border-[#1f293d] bg-[#111722] pl-10 pr-20 text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/browse?sort=popular"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1f293d] bg-[#111722] hover:bg-[#192233] text-xs font-semibold text-amber-400 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Trending</span>
            </Link>

            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#111722] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar in sub-row */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, year, language..."
              className="w-full h-9 rounded-lg border border-[#1f293d] bg-[#111722] pl-9 pr-16 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded bg-emerald-500 text-black font-bold text-[11px]"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY SUB-NAV BAR (1TamilMV signature horizontal strip) */}
      <div className="border-t border-[#1f293d] bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-2 sm:px-6">
          <nav className="flex items-center overflow-x-auto hide-scrollbar gap-1 py-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-gray-300 hover:bg-[#192233] hover:text-emerald-400'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-black tracking-tight ${
                        tab.badge === 'HOT'
                          ? 'bg-red-600 text-white'
                          : tab.badge === 'NEW'
                          ? 'bg-blue-600 text-white'
                          : tab.badge === 'TOP'
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#1f293d] bg-[#0d121c] p-4 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#111722] border border-[#1f293d] text-xs font-bold text-gray-200 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1f293d] flex items-center justify-around text-xs">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-400 hover:text-emerald-400 font-semibold"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-400 font-bold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
