"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import "../globals.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/(app)" },
    { name: "Listings", path: "/(app)/listings" },
    { name: "Map", path: "/(app)/map" },
    { name: "New Listing", path: "/(app)/listings/new" },
    { name: "Login", path: "/(app)/login" },
    { name: "Signup", path: "/(app)/signup" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-xl font-bold mb-6 text-gray-800">SlugSpot</h1>
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Hamburger Menu (Mobile) */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="text-lg font-semibold text-gray-800">
              SlugSpot
            </span>
          </div>

          {/* Right Side Placeholder */}
          <div>
            {/* Example: <Link href="/profile">Profile</Link> */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

