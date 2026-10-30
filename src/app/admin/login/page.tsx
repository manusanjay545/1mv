'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { setAuthToken } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If Supabase is not configured yet, check demo credentials fallback
        if (
          (email === 'admin@example.com' || email === 'admin') &&
          password === 'changeme123'
        ) {
          setAuthToken('demo-admin-token-movievault');
          router.push('/admin');
          return;
        }
        throw new Error(data.error || 'Authentication failed');
      }

      const token = data.session?.accessToken;
      if (token) {
        setAuthToken(token);
        router.push('/admin');
      } else {
        throw new Error('No access token returned');
      }
    } catch (err: unknown) {
      // Allow fallback if demo credentials are typed
      if (
        (email === 'admin@example.com' || email === 'admin') &&
        password === 'changeme123'
      ) {
        setAuthToken('demo-admin-token-movievault');
        router.push('/admin');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[300px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-900 bg-gray-900/80 p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-3 shadow-lg shadow-rose-950">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Authentication</h1>
          <p className="text-xs text-gray-400 mt-1">
            Access the MovieVault management console
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-600 outline-none focus:border-rose-500"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-600 outline-none focus:border-rose-500"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950 hover:from-rose-500 hover:to-red-500 active:scale-95 transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-800/80 pt-4 text-center">
          <p className="text-[11px] text-gray-500">
            Default credentials for local setup: <br />
            <span className="text-gray-400 font-mono">admin@example.com</span> /{' '}
            <span className="text-gray-400 font-mono">changeme123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
