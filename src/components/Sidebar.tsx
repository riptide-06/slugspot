"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import clsx from "clsx"

type Props = {
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
}

const items = [
  { href: "/listings", label: "Dashboard", icon: "🏠" },
  { href: "/map", label: "Interactive Map", icon: "🗺️" },
  { href: "/search", label: "Search & Questions", icon: "🔍" },
  { href: "/booking", label: "Book Services", icon: "📅" },
  { href: "/profile", label: "My Profile", icon: "👤" },
  { href: "/payment", label: "Payment", icon: "💳" },
]

export default function Sidebar({ variant = "desktop", onNavigate }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white shadow-card",
        variant === "desktop" ? "p-3" : "p-4"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-1 pb-3">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2">
          <Image
            src="/slugspot-logo.png"
            alt="SlugSpot"
            width={28}
            height={28}
            className="rounded-sm"
            priority={variant === "desktop"}
          />
          <span className="font-semibold">SlugSpot</span>
        </Link>
        {variant === "mobile" && (
          <button
            onClick={onNavigate}
            className="ml-auto rounded-md border border-slate-300 px-2 py-1 text-xs"
          >
            Close
          </button>
        )}
      </div>

      <nav className="space-y-1">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onNavigate}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-brand text-white"
                  : "text-slate-800 hover:bg-slate-100"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{it.icon}</span>
                {it.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

