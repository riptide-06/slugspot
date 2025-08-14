// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/lib/supabaseClient";
import Avatar from "@/components/Avatar";

export default function Header() {
  const { user } = useAuthUser();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || "User";

  return (
    <header className="w-full sticky top-0 z-50 bg-brand text-white shadow-sm" style={{ backgroundColor: "#0B3B76" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo → home */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/slugspot-logo.png"  // ensure this exists in /public
            alt="SlugSpot"
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          <span className="hidden sm:inline font-semibold">SlugSpot</span>
        </Link>

        {/* Right side: auth-aware */}
        {!user ? (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/map" className="hover:underline">Map</Link>
            <Link href="/login" className="hover:underline">Log in</Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/80 bg-white/10 hover:bg-white/15 text-white px-4 py-1.5 font-medium"
            >
              Sign up
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar name={displayName} size={28} />
              <span className="text-white/90 text-sm">{displayName}</span>
            </div>
            <button
              onClick={logout}
              className="rounded-full border border-white/80 bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

