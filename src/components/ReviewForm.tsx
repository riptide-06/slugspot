"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewForm({
  listingId,
  onSubmitted,
}: { listingId: string; onSubmitted?: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setErr("log in with your ucsc.edu email to post a review.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      listing_id: listingId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });

    setBusy(false);
    if (error) return setErr(error.message);

    setRating(5);
    setComment("");
    onSubmitted?.();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-sm"
        >
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="share a quick thought…"
        className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
        rows={3}
      />

      {err && <p className="text-sm text-red-600">{err}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-brand text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {busy ? "posting…" : "post review"}
      </button>
    </form>
  );
}

