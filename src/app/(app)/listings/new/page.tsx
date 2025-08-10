'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewListingPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in to add a listing.')
      setLoading(false)
      return
    }

    // Insert into DB with user ID
    const { error: insertError } = await supabase
      .from('listings')
      .insert({ title, description, user_id: user.id }) // update to match your column!

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      router.push('/')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            required
            className="w-full border rounded p-2"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
            required
            className="w-full border rounded p-2"
            rows={5}
            maxLength={1000}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </form>
    </main>
  )
}

