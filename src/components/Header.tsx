'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Shield, Flame } from 'lucide-react';

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
  { label: 'ALL', href: '/browse?sort=newest', badge: null },
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
    <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #1f293d', backgroundColor: 'rgba(11,14,20,0.97)', backdropFilter: 'blur(12px)' }}>
      {/* TOP TICKER BAR */}
      <div style={{ backgroundColor: '#121824', borderBottom: '1px solid #1f293d', padding: '6px 12px', fontSize: '11px', color: '#d1d5db', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingRight: '12px', borderRight: '1px solid #1f293d' }}>
          <span style={{ position: 'relative', display: 'inline-flex', height: '8px', width: '8px' }}>
            <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '9999px', backgroundColor: '#34d399', opacity: 0.75, animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', height: '8px', width: '8px', backgroundColor: '#10b981' }} />
          </span>
          <span style={{ fontWeight: 700, color: '#34d399', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>
            AUTO SYNC 15m
          </span>
        </div>

        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, padding: '0 16px' }}>
          <div className="animate-marquee" style={{ display: 'inline-block', color: '#d1d5db' }}>
            <span style={{ margin: '0 16px', color: '#34d399', fontWeight: 600 }}>★ OFFICIAL CATALOGUE PORTAL ★</span>
            <span style={{ margin: '0 16px' }}>Bookmark this domain: <strong style={{ color: '#fff' }}>1MovieVault</strong> • Regular 4K, 1080p, 720p HD Updates</span>
            <span style={{ margin: '0 16px', color: '#fbbf24', fontWeight: 600 }}>• Tamil • Telugu • Malayalam • Hindi • Kannada • English</span>
            <span style={{ margin: '0 16px', color: '#34d399', fontWeight: 600 }}>★ High Speed Direct Mirrors ★</span>
          </div>
        </div>

        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '12px', flexShrink: 0, paddingLeft: '12px', borderLeft: '1px solid #1f293d' }}>
          <Link href="/admin" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
            <Shield style={{ height: '12px', width: '12px', color: '#34d399' }} />
            Admin
          </Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 12px' }}>
        <div style={{ display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', width: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #dc2626, #f59e0b)', color: '#fff', fontWeight: 900, fontSize: '18px' }}>
              1
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
                MOVIE<span style={{ color: '#00d26a' }}>VAULT</span>
              </span>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', fontWeight: 600, marginTop: '-2px' }}>
                HD Catalogue • Fast Mirror
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex" style={{ flex: 1, maxWidth: '480px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, web series, year..."
                style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid #1f293d', backgroundColor: '#111722', paddingLeft: '40px', paddingRight: '80px', fontSize: '12px', color: '#fff', outline: 'none' }}
              />
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', height: '16px', width: '16px', color: '#6b7280' }} />
              <button
                type="submit"
                style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', height: '32px', padding: '0 14px', borderRadius: '6px', backgroundColor: '#00d26a', color: '#000', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer' }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/browse?sort=popular"
              className="hidden lg:inline-flex"
              style={{ alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1f293d', backgroundColor: '#111722', fontSize: '12px', fontWeight: 600, color: '#fbbf24', textDecoration: 'none' }}
            >
              <Flame style={{ height: '14px', width: '14px', color: '#fbbf24' }} />
              Trending
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              style={{ padding: '8px', borderRadius: '8px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X style={{ height: '24px', width: '24px' }} /> : <Menu style={{ height: '24px', width: '24px' }} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden" style={{ paddingBottom: '12px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid #1f293d', backgroundColor: '#111722', paddingLeft: '36px', paddingRight: '64px', fontSize: '12px', color: '#fff', outline: 'none' }}
            />
            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', height: '14px', width: '14px', color: '#6b7280' }} />
            <button
              type="submit"
              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', height: '28px', padding: '0 10px', borderRadius: '4px', backgroundColor: '#00d26a', color: '#000', fontWeight: 800, fontSize: '11px', border: 'none', cursor: 'pointer' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* CATEGORY NAV BAR */}
      <div style={{ borderTop: '1px solid #1f293d', backgroundColor: '#0d121c' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 8px' }}>
          <nav className="hide-scrollbar" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', gap: '4px', padding: '6px 0' }}>
            {CATEGORY_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    backgroundColor: isActive ? '#00d26a' : 'transparent',
                    color: isActive ? '#000' : '#d1d5db',
                  }}
                >
                  {tab.label}
                  {tab.badge && (
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontWeight: 900,
                      backgroundColor: tab.badge === 'HOT' ? '#dc2626' : tab.badge === 'NEW' ? '#2563eb' : tab.badge === 'TOP' ? '#f59e0b' : 'rgba(0,210,106,0.2)',
                      color: tab.badge === 'TOP' ? '#000' : '#fff',
                    }}>
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ borderTop: '1px solid #1f293d', backgroundColor: '#0d121c', padding: '16px' }} className="md:hidden">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {CATEGORY_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: '#111722', border: '1px solid #1f293d', fontSize: '12px', fontWeight: 700, color: '#e5e7eb', textDecoration: 'none' }}
              >
                {tab.label}
                {tab.badge && (
                  <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(0,210,106,0.2)', color: '#34d399', border: '1px solid rgba(0,210,106,0.3)' }}>
                    {tab.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
