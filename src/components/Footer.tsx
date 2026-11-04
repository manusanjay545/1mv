import Link from 'next/link';
import { Film, Shield, Lock, Radio, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1f293d] bg-[#070a0f] text-xs">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Col 1: Branding & Description */}
          <div className="md:col-span-2 space-y-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center h-7 w-7 rounded bg-red-600 text-white font-black text-sm">
                1
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                MOVIE<span className="text-emerald-400">VAULT</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs max-w-md leading-relaxed">
              Official catalogue portal for South Indian &amp; Bollywood movie releases.
              Direct links, fast resumable downloads, and automated updates every 15 minutes.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Auto 15m Sync Active
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Shield className="h-3 w-3 text-gray-400" />
                ShrinkMe Protected
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Server className="h-3 w-3 text-gray-400" />
                Vercel + Supabase
              </span>
            </div>
          </div>

          {/* Col 2: Movie Categories */}
          <div>
            <h4 className="text-xs font-black text-gray-200 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/browse?language=Tamil" className="hover:text-emerald-400 transition-colors">
                  Tamil Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?language=Telugu" className="hover:text-emerald-400 transition-colors">
                  Telugu Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?language=Malayalam" className="hover:text-emerald-400 transition-colors">
                  Malayalam Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?language=Hindi" className="hover:text-emerald-400 transition-colors">
                  Hindi Dubbed
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Web+Series" className="hover:text-emerald-400 transition-colors">
                  Web Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div>
            <h4 className="text-xs font-black text-gray-200 uppercase tracking-wider mb-2.5">
              Portal Links
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/browse?sort=newest" className="hover:text-emerald-400 transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=popular" className="hover:text-emerald-400 transition-colors">
                  Top Trending
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Admin Management
                </Link>
              </li>
              <li>
                <Link href="/admin/sync" className="hover:text-emerald-400 transition-colors">
                  Sync Settings
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-emerald-400 transition-colors">
                  Monetization Clicks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer / Bottom Bar */}
        <div className="border-t border-[#1f293d] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <p>
            &copy; {new Date().getFullYear()} MovieVault &bull; All catalogue metadata is aggregated for indexing purposes only.
          </p>
          <p className="text-gray-400">
            Powered by Next.js &bull; Fast CDN &bull; 15-Minute Sync Engine
          </p>
        </div>
      </div>
    </footer>
  );
}
