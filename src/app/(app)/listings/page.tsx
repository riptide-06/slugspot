'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Avatar from '@/components/Avatar'
import Sidebar from '@/components/Sidebar'
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

export default function ListingsPage() {
  const [items, setItems] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('new')
  const [user, setUser] = useState<any>(null)

  const sp = useSearchParams()
  const router = useRouter()
  const q = (sp.get('q') ?? '').toLowerCase()

  // auth gate
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

  // not logged in view (with sidebar layout)
  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[256px,1fr] gap-6">
          <div className="hidden md:block"><Sidebar variant="desktop" /></div>
          <section className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold">listings</h1>
            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3">
              <p className="text-amber-900 text-sm">
                log in to search and view listings.
              </p>
              <div className="mt-3 flex gap-2">
                <a href="/login" className="rounded-md bg-brand text-white px-4 py-2 text-sm">log in</a>
                <a href="/signup" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm">sign up</a>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              tip: start from the homepage search — once logged in, it’ll bring you back here with your query.
            </p>
          </section>
        </div>
      </div>
    )
  }

  // logged-in view
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[256px,1fr] gap-6">
        <div className="hidden md:block"><Sidebar variant="desktop" /></div>
        <section className="space-y-4">
          {/* Welcome Message for Dashboard */}
          <div className="bg-gradient-to-r from-brand to-brand/80 text-white rounded-2xl p-6 shadow-card">
            <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-white/90 mb-4">
              Discover the best spots on campus, connect with fellow students, and make the most of your UCSC experience.
            </p>
            <div className="flex gap-3">
              <a href="/search" className="bg-white text-brand px-4 py-2 rounded-lg font-medium hover:opacity-90">
                Ask a Question
              </a>
              <a href="/map" className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30">
                Explore Map
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Campus Listings</h2>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSort('new')}
                className={`rounded-full px-3 py-1.5 border ${
                  sort === 'new'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                newest
              </button>
              <button
                onClick={() => setSort('az')}
                className={`rounded-full px-3 py-1.5 border ${
                  sort === 'az'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                a–z
              </button>
              <button
                onClick={() => setSort('top')}
                className={`rounded-full px-3 py-1.5 border ${
                  sort === 'top'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                top rated
              </button>
            </div>
          </div>

          {q && (
            <p className="text-xs sm:text-sm text-slate-500">
              search: “{q}” — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              <button className="ml-2 underline" onClick={() => router.push('/listings')} aria-label="clear search">
                clear
              </button>
            </p>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && err && <p className="text-red-600">could not load listings: {err}</p>}

          {!loading && !err && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map(it => (
                <article key={it.id} className="bg-white rounded-2xl shadow-card hover:shadow-lg transition overflow-hidden border border-slate-100">
                  <div className="h-32 sm:h-36 w-full bg-slate-200" />
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">
                      <Link href={`/listings/${it.id}`} className="hover:underline">{it.title}</Link>
                    </h3>
                    <p className="text-[13px] sm:text-sm text-slate-600 line-clamp-3">{it.description}</p>
                    <div className="flex items-center justify-between pt-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Avatar name={it.author_full_name || it.author_email || 'User'} size={28} />
                        <span className="text-slate-700 text-xs sm:text-sm">
                          {it.author_full_name || it.author_email || 'Unknown'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Stars value={Number(it.avg_rating) || 0} />
                        <span className="text-slate-500 text-xs sm:text-sm">
                          {Number(it.avg_rating).toFixed(1)} · {it.review_count}
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !err && filtered.length === 0 && (
            <p className="text-slate-600">no results. try a different search.</p>
          )}
        </section>
      </div>
    </div>
  )
}

