'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Avatar from '@/components/Avatar'
import { supabase } from '@/lib/supabaseClient'

type StatCard = {
  id: string
  title: string
  description: string | null
  created_at: string
  author_full_name: string | null
  author_email: string | null
  avg_rating: number
  review_count: number
}

type SortKey = 'new' | 'az' | 'top'

function Stars({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <span className="text-amber-500">
      {'★'.repeat(filled)}
      <span className="text-slate-300">{'★'.repeat(5 - filled)}</span>
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-32 sm:h-36 w-full bg-slate-200" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
      </div>
    </div>
  )
}

function ListingsContent() {
  const [items, setItems] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('new')
  const [user, setUser] = useState<any>(null)

  const sp = useSearchParams()
  const router = useRouter()
  const q = (sp.get('q') ?? '').toLowerCase()

  // auth check
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) setUser(data.user ?? null)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // data load (only when logged in)
  useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      setLoading(true); setErr(null)
      try {
        const { data, error } = await supabase
          .from('listings_stats')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (mounted) setItems((data || []) as StatCard[])
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [user])

  const filtered = useMemo(() => {
    const base = q
      ? items.filter(it =>
          it.title?.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          (it.author_full_name?.toLowerCase().includes(q) ?? false) ||
          (it.author_email?.toLowerCase().includes(q) ?? false)
        )
      : items

    if (sort === 'az') return [...base].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'top') {
      return [...base].sort((a, b) => {
        if (b.avg_rating !== a.avg_rating) return Number(b.avg_rating) - Number(a.avg_rating)
        if (b.review_count !== a.review_count) return b.review_count - a.review_count
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }
    return [...base].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [items, q, sort])

  // not logged in view
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Campus Listings</h1>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-8 max-w-md mx-auto">
            <p className="text-amber-900 mb-4">
              Log in to search and view listings from UCSC students.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="rounded-lg bg-brand text-white px-6 py-2 font-medium">
                Log in
              </Link>
              <Link href="/signup" className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // logged-in view
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campus Listings</h1>
          <p className="text-slate-600 mt-1">Discover the best spots on campus</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setSort('new')}
            className={`rounded-full px-4 py-2 border transition-colors ${
              sort === 'new'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort('az')}
            className={`rounded-full px-4 py-2 border transition-colors ${
              sort === 'az'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            A–Z
          </button>
          <button
            onClick={() => setSort('top')}
            className={`rounded-full px-4 py-2 border transition-colors ${
              sort === 'top'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {q && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-900">
            Search: "{q}" — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            <button 
              className="ml-2 underline hover:no-underline" 
              onClick={() => router.push('/listings')}
            >
              Clear
            </button>
          </p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && err && (
        <div className="text-center py-12">
          <p className="text-red-600">Could not load listings: {err}</p>
        </div>
      )}

      {!loading && !err && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(it => (
            <article key={it.id} className="bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 overflow-hidden border border-slate-100">
              <div className="h-36 w-full bg-slate-200" />
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold leading-snug">
                  <Link href={`/listings/${it.id}`} className="hover:text-brand transition-colors">
                    {it.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">{it.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={it.author_full_name || it.author_email || 'User'} size={28} />
                    <span className="text-sm text-slate-700">
                      {it.author_full_name || it.author_email || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Stars value={Number(it.avg_rating) || 0} />
                    <span className="text-sm text-slate-500">
                      {Number(it.avg_rating).toFixed(1)} · {it.review_count}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No results found. Try a different search.</p>
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><div className="text-center">Loading...</div></div>}>
      <ListingsContent />
    </Suspense>
  )
}