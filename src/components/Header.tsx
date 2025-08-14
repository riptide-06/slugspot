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
    router.push("/");
    router.refresh();
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || "User";

  return (
    <header className="w-full sticky top-0 z-50 bg-brand text-white shadow-sm" style={{ backgroundColor: "#0B3B76" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo → home */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Image
            src="/slugspot-logo.png"
            alt="SlugSpot"
            width={32}
            height={32}
            className="rounded-sm"
            priority
          />
          <span className="font-bold text-xl">SlugSpot</span>
        </Link>

        {/* Navigation */}
        {!user ? (
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <Link href="/map" className="hover:text-white/80 transition-colors">Map</Link>
            <Link href="/login" className="hover:text-white/80 transition-colors">Log in</Link>
            <Link
              href="/signup"
              className="rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white px-4 py-2 font-medium transition-colors"
            >
              Sign up
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:text-white/80 transition-colors">Dashboard</Link>
              <Link href="/search" className="hover:text-white/80 transition-colors">Search</Link>
              <Link href="/map" className="hover:text-white/80 transition-colors">Map</Link>
              <Link href="/booking" className="hover:text-white/80 transition-colors">Booking</Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar name={displayName} size={32} />
                <span className="hidden sm:inline text-white/90 text-sm">{displayName.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}