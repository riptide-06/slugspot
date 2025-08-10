// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SlugSpot",
  description: "For Students, By Students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

