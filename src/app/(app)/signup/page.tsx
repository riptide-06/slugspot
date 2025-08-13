'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();

  // form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // if already logged in, bounce to listings
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted && data.user) router.replace('/listings');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // basic validation
    if (!fullName.trim()) return setErr('please enter your full name.');
    if (!email.trim()) return setErr('please enter your email.');
    if (password.length < 6) return setErr('password must be at least 6 characters.');
    if (password !== confirm) return setErr('passwords do not match.');

    setBusy(true);

    // sign up with metadata (full_name)
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

    // If email confirmation is ON, Supabase returns user=null and sends a verification email.
    // If confirmation is OFF (dev), user is immediately logged in.
    if (!data.user) {
      // confirmation flow
      router.replace('/login?checkEmail=1');
      return;
    }

    // logged in (dev) → go to listings
    router.replace('/listings');
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* form card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-xl font-semibold">sign up</h1>
          <p className="mt-1 text-sm text-slate-600">use your ucsc.edu email.</p>

          <form onSubmit={handleSignup} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2"
                placeholder="Sam Slug"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-brand text-white px-4 py-2 font-medium disabled:opacity-60"
            >
              {busy ? 'creating account…' : 'create account'}
            </button>

            <p className="text-sm text-slate-600">
              already have an account?{' '}
              <a href="/login" className="underline">log in</a>
            </p>
          </form>
        </div>

        {/* right card */}
        <div className="rounded-2xl border border-slate-200 bg-[#0B3B76] text-white p-6 shadow-card">
          <h2 className="text-xl font-semibold">SlugSpot</h2>
          <p className="mt-2 text-sm text-white/90">
            find the best coffee, study spots, and services around campus — verified by students.
          </p>
          <p className="mt-6 text-xs text-white/80">for everyone, by everyone.</p>
        </div>
      </div>
    </div>
  );
}

