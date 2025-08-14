"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Suggestion = { id: string; label: string };
type Props = {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  suggestions?: Suggestion[] | null | undefined;
  requireAuth?: boolean; // gate search for logged-out
};

export default function SearchBar({
  placeholder = "Find places or ask a question…",
  defaultValue,
  className = "",
  suggestions,
  requireAuth = false,
}: Props) {
  const router = useRouter();

  const [value, setValue] = useState(defaultValue ?? "");
  const [user, setUser] = useState<any>(null);
  const [showAuthMsg, setShowAuthMsg] = useState(false);

  useEffect(() => {
    setValue(defaultValue ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  function goTo(q: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/listings?${params.toString()}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (requireAuth && !user) {
      setShowAuthMsg(true);
      return;
    }
    goTo(value);
  }

  const safeSuggestions: Suggestion[] = useMemo(
    () => (Array.isArray(suggestions) ? suggestions : []),
    [suggestions]
  );

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg px-3 py-2 text-slate-800 outline-none"
          aria-label="Search"
        />
        <button
          type="submit"
          className="rounded-md bg-brand text-white px-4 py-2 text-sm font-medium"
        >
          Search
        </button>
      </form>

      {safeSuggestions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {safeSuggestions.map((s) => (
            <li
              key={s.id}
              className="cursor-pointer rounded-md px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50"
              onClick={() => goTo(s.label)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}

      {showAuthMsg && !user && requireAuth && (
        <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Log in to search.
          <div className="mt-2 flex gap-2">
            <a href="/login" className="rounded-md bg-brand text-white px-3 py-1 text-sm">Log in</a>
            <a href="/signup" className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm">Sign up</a>
          </div>
        </div>
      )}
    </div>
  );
}

