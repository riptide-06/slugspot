'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ReviewFormProps {
  listingId: string
  userId: string
  onSubmitted?: () => void
}

export default function ReviewForm({
  listingId,
  userId,
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1) insert the new review
    const { error: revError } = await supabase
      .from('reviews')
      .insert({
        listing_id: listingId,
        user_id: userId,
        rating,
        comment,
      })

    if (revError) {
      setError(revError.message)
      setLoading(false)
      return
    }

    // 2) award points via RPC
    const { error: rpcError } = await supabase.rpc(
      'increment_user_points',
      {
        p_user_id: userId,
        p_points: 5, // adjust award as desired
      }
    )

    if (rpcError) {
      setError(rpcError.message)
    }

    setLoading(false)
    setRating(0)
    setComment('')
    onSubmitted?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-4 border rounded"
    >
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Your Rating</label>
        <select
          value={rating}
          onChange={e => setRating(+e.currentTarget.value)}
          required
          className="border rounded p-2 w-full"
        >
          <option value={0} disabled>
            Select…
          </option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.currentTarget.value)}
          required
          rows={4}
          className="border rounded p-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}

