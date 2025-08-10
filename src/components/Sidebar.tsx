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
  { href: "/map", label: "Interactive Map" },
  { href: "/questions", label: "Questions" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorite Spots" },
  { href: "/history", label: "History" },
  { href: "/my-spots", label: "Your Spots" },
  { href: "/help", label: "Get Help" },
  { href: "/about", label: "About" },
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
              {it.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

