import Link from 'next/link';
import { Film, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold text-white tracking-tight">
                Movie<span className="text-rose-500">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md">
              A high-performance movie & web series catalogue inspired by modern dark directory layouts.
              Browse releases across Tamil, Telugu, Malayalam, Kannada, Hindi and English.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Compliant indexing & authorized redistribution metadata</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=newest" className="hover:text-rose-400 transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Web+Series" className="hover:text-rose-400 transition-colors">
                  Web Series
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=popular" className="hover:text-rose-400 transition-colors">
                  Trending
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Management
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/sync" className="hover:text-rose-400 transition-colors">
                  Sync Settings
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-rose-400 transition-colors">
                  Monetization & Clicks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} MovieVault. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-gray-600">
            Powered by Next.js & Supabase &bull; Automated 15m Sync &bull; ShrinkMe Integration
          </p>
        </div>
      </div>
    </footer>
  );
}
