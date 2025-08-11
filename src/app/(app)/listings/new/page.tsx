'use client'
import RequireAuth from '@/components/RequireAuth'

export default function NewListingPage() {
  return (
    <RequireAuth>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-card">
        {/* TODO: build the actual form next (title, description, image upload) */}
        new listing form goes here
      </div>
    </RequireAuth>
  )
}

