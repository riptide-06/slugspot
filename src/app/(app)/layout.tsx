"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Sidebar from "@/components/Sidebar"

export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar with hamburger (md:hidden) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          Menu
        </button>
        <a href="/" className="font-semibold">SlugSpot</a>
        <span className="w-[66px]" />
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[256px,1fr] gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar variant="desktop" />
        </div>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl">
            <Sidebar variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}

