// src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, bounce to home
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted && data.user) {
        router.replace("/"); // already logged in
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'ucsc.edu' // Restrict to UCSC domain
        },
        redirectTo: `${window.location.origin}/listings`
      }
    });
    if (error) setErr(error.message);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    
    // Validate UCSC email for manual login
    if (!email.endsWith('@ucsc.edu')) {
      setErr('Please use your @ucsc.edu email address.');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h1 className="text-xl font-semibold">Log in</h1>
          <p className="text-sm text-slate-600">Sign in with your UCSC email to leave reviews and suggestions.</p>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google (UCSC)
          </button>

          <div className="flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-3 text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <label className="block text-sm">
            <span className="text-slate-700">UCSC Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ucsc.edu"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-700">Password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand text-white py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="text-sm text-slate-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-brand underline">Sign up</a>
          </p>
        </form>

        {/* right-side panel left as-is */}
        <div className="rounded-2xl bg-brand text-white p-6">
          <h2 className="text-lg font-semibold">SlugSpot</h2>
          <p className="mt-2 text-white/90">
            Find the best coffee, study spots, and services around campus — verified by students.
          </p>
          <p className="mt-6 text-sm text-white/80">For Everyone, By Everyone.</p>
        </div>
      </div>
    </section>
  );
}

