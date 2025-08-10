'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)

    if (!email.endsWith('@ucsc.edu')) return setMsg('Please use your @ucsc.edu email')
    if (password !== confirm) return setMsg('Passwords do not match')
    if (username.trim().length < 2) return setMsg('Username must be at least 2 characters')

    setLoading(true)
    // 1) Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // you can also include user_metadata here if you want
    })
    if (error) {
      setLoading(false)
      return setMsg(error.message)
    }

    const authed = data.user
    if (!authed) {
      setLoading(false)
      return setMsg('Sign up succeeded—check your email to continue.')
    }

    // 2) Save profile (requires RLS policy: insert/update where id = auth.uid())
    await supabase
      .from('users')
      .upsert(
        { id: authed.id, full_name: fullName.trim(), email, username: username.trim() },
        { onConflict: 'id' }
      )

    setLoading(false)
    router.push('/')
    router.refresh()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        {/* Left: form */}
        <div className="p-8">
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-sm text-slate-600 mt-1">Create your account to post and review listings.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3B76]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">UCSC email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@ucsc.edu"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3B76]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3B76]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3B76]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.currentTarget.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3B76]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#FFD166] text-slate-900 py-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            {msg && <p className="text-sm text-red-600">{msg}</p>}
          </form>

          <p className="text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0B3B76] underline">Log in</Link>
          </p>
        </div>

        {/* Right: brand panel */}
        <div className="bg-[#0B3B76] text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-white/20 grid place-items-center text-xl">🦪</div>
              <div className="text-2xl font-semibold">SlugSpot</div>
            </div>
            <p className="mt-4 text-white/90">
              Trusted reviews and listings, verified by @ucsc.edu accounts only. Join the hive 🐌📍
            </p>
          </div>
          <div className="text-xs text-white/70">For Students, By Students.</div>
        </div>
      </div>
    </main>
  )
}

