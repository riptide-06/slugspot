'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Avatar from '@/components/Avatar'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Detail = {
  id: string
  title: string
  description: string | null
  created_at: string
  author_full_name: string | null
  author_email: string | null
  avg_rating: number
  review_count: number
}

type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  // add fields if you expose reviewer names/emails in your reviews view
}

function Stars({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <span className="text-amber-500">
      {'★'.repeat(filled)}
      <span className="text-slate-300">{'★'.repeat(5 - filled)}</span>
    </span>
  )
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Detail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        // 1) Load the listing (from the stats view so we have rating + counts)
        const { data: detail, error: dErr } = await supabase
          .from('listings_stats')
          .select('*')
          .eq('id', params.id)
          .maybeSingle()

        if (dErr) throw dErr
        if (!detail) {
          if (mounted) setErr('Not found')
          return
        }
        if (mounted) setItem(detail as Detail)

        // 2) Load reviews (basic fields; tweak to match your schema)
        const { data: revs, error: rErr } = await supabase
          .from('reviews')
          .select('id,rating,comment,created_at')
          .eq('listing_id', params.id)
          .order('created_at', { ascending: false })

        if (rErr) {
          // don’t fail the whole page if reviews are blocked by RLS
          console.warn('Reviews load failed:', rErr.message)
        } else if (mounted) {
          setReviews((revs || []) as Review[])
        }
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [params.id])

  // Loading state
  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl animate-pulse">
          <div className="h-6 w-40 bg-slate-200 rounded mb-4" />
          <div className="h-48 w-full bg-slate-200 rounded-2xl mb-4" />
          <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
        </div>
      </section>
    )
  }

  // Not found / error
  if (err || !item) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <p className="text-red-600 mb-3">{err || 'Listing not found.'}</p>
          <Link href="/" className="text-brand underline">
            ← Back to listings
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl space-y-6">
        {/* Breadcrumb / back */}
        <div>
          <Link href="/" className="text-sm text-slate-600 hover:underline">
            ← Back to listings
          </Link>
        </div>

        {/* Title + author + rating */}
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{item.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Avatar name={item.author_full_name || item.author_email || 'User'} size={36} />
              <div className="leading-tight">
                <p className="text-sm font-medium">
                  {item.author_full_name || item.author_email || 'Unknown'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stars value={Number(item.avg_rating) || 0} />
              <span className="text-slate-600 text-sm">
                {Number(item.avg_rating).toFixed(1)} · {item.review_count} review
                {item.review_count === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </header>

        {/* Image area placeholder */}
        <div className="bg-slate-200 rounded-2xl h-56 sm:h-72 w-full flex items-center justify-center">
          <span className="text-slate-600 text-sm">
            Listing images coming soon
          </span>
        </div>

        {/* Description */}
        <article className="prose prose-slate max-w-none">
          <p className="text-slate-700 whitespace-pre-wrap">
            {item.description || 'No description provided.'}
          </p>
        </article>

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-600 text-sm">No reviews yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {reviews.map((r) => (
                <li key={r.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Stars value={Number(r.rating) || 0} />
                    <span className="text-xs text-slate-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{r.comment || '—'}</p>
                </li>
              ))}
            </ul>
          )}
          {/* Optional: when you’re ready to enable posting reviews, mount your ReviewForm here */}
          {/* <ReviewForm listingId={item.id} /> */}
        </section>
      </div>
    </section>
  )
}

