'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted && data.user) router.replace('/dashboard');
    })();
    return () => { mounted = false; };
  }, [router]);

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'ucsc.edu'
        },
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) setErr(error.message);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!fullName.trim()) return setErr('Please enter your full name.');
    if (!email.trim()) return setErr('Please enter your UCSC email.');
    if (!email.endsWith('@ucsc.edu')) return setErr('Please use your @ucsc.edu email address.');
    if (password.length < 6) return setErr('Password must be at least 6 characters.');
    if (password !== confirm) return setErr('Passwords do not match.');

    setBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    setBusy(false);

    if (error) {
      setErr(error.message);
      return;
    }

    if (!data.user) {
      router.replace('/login?checkEmail=1');
      return;
    }

    router.replace('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Join SlugSpot</h2>
          <p className="mt-2 text-slate-600">Create your account with your UCSC email</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-card p-8 border border-slate-200">
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google (UCSC)
          </button>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-3 text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            {err && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{err}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="Sam Slug"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                UCSC Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="you@ucsc.edu"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-brand focus:border-brand"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-brand text-white py-2 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {busy ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="text-brand font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}