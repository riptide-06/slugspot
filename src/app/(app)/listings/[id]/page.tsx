"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ReviewForm from "@/components/ReviewForm";

type Detail = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  author_full_name: string | null;
  author_email: string | null;
  avg_rating: number | null;
  review_count: number;
};

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Detail | null>(null);
  const [reviews, setReviews] = useState[<Review[]>]([]) as any; // TS quirk fix below
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // fix TS for reviews state without extra types noise
  useEffect(() => {
    if (!Array.isArray(reviews)) setReviews([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auth state
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // load detail + reviews
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data: detail, error: e1 } = await supabase
          .from("listings_stats")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (e1) throw e1;
        if (mounted) setItem(detail as any);

        const { data: revs, error: e2 } = await supabase
          .from("reviews")
          .select("id,user_id,rating,comment,created_at")
          .eq("listing_id", id)
          .order("created_at", { ascending: false });
        if (e2) throw e2;
        if (mounted) setReviews((revs || []) as Review[]);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">loading…</div>;
  if (err) return <div className="p-6 text-red-600">error: {err}</div>;
  if (!item) return <div className="p-6">not found</div>;

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
        <h1 className="text-xl sm:text-2xl font-bold">{item.title}</h1>
        {item.description && <p className="mt-2 text-slate-700">{item.description}</p>}
        <p className="mt-2 text-sm text-slate-500">
          {Number(item.avg_rating ?? 0).toFixed(1)} · {item.review_count} reviews
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-slate-600 text-sm">no reviews yet — be the first!</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r: Review) => (
              <li key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {"★".repeat(r.rating)}
                    <span className="text-slate-300">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="mt-2 text-slate-700 text-sm">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <div className="pt-2">
            <ReviewForm
              listingId={item.id}
              onSubmitted={async () => {
                const { data: revs } = await supabase
                  .from("reviews")
                  .select("id,user_id,rating,comment,created_at")
                  .eq("listing_id", item.id)
                  .order("created_at", { ascending: false });
                setReviews((revs || []) as Review[]);

                const { data: detail } = await supabase
                  .from("listings_stats")
                  .select("*")
                  .eq("id", item.id)
                  .maybeSingle();
                if (detail) setItem(detail as any);
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            log in with your <b>ucsc.edu</b> email to leave a review.
          </p>
        )}
      </section>
    </div>
  );
}

