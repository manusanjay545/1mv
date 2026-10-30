'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Tag,
  RefreshCw,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { isAuthenticated, removeAuthToken } from '@/lib/admin-auth';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Movies', href: '/admin/movies', icon: Film },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Auto Sync', href: '/admin/sync', icon: RefreshCw },
  { label: 'Click Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    if (!isLoginPage && !isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent flash before mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-gray-900 bg-gray-950 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-rose-500" />
          <span className="font-bold text-white text-sm">MovieVault Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 border-r border-gray-900 bg-gray-950 p-4 flex flex-col justify-between shrink-0`}
      >
        <div className="space-y-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 border-b border-gray-900 pb-4">
            <Shield className="h-6 w-6 text-rose-500" />
            <div>
              <span className="font-bold text-white text-base tracking-tight block">
                Movie<span className="text-rose-500">Vault</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-900 pt-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
