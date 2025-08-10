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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
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
          <p className="text-sm text-slate-600">Get verified to leave reviews and suggestions.</p>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <label className="block text-sm">
            <span className="text-slate-700">UCSC email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sp@ucsc.edu"
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
            Find the best coffee, study spots, and services around UCSC — verified by students.
          </p>
          <p className="mt-6 text-sm text-white/80">For Students, By Students.</p>
        </div>
      </div>
    </section>
  );
}

