"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Search, Calendar, User, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function DashboardPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand to-brand/80 text-white rounded-2xl p-8 mb-8 shadow-card">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName.split(' ')[0]}! 👋</h1>
        <p className="text-white/90 text-lg">
          Ready to explore the best spots on campus? Let's find your next favorite place.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/search" className="group">
          <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-200 border border-slate-200 group-hover:border-brand/20">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Search & Ask</h3>
            <p className="text-sm text-slate-600">Find places or ask questions</p>
          </div>
        </Link>

        <Link href="/map" className="group">
          <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-200 border border-slate-200 group-hover:border-brand/20">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Interactive Map</h3>
            <p className="text-sm text-slate-600">Explore campus locations</p>
          </div>
        </Link>

        <Link href="/booking" className="group">
          <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-200 border border-slate-200 group-hover:border-brand/20">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Book Services</h3>
            <p className="text-sm text-slate-600">Schedule appointments</p>
          </div>
        </Link>

        <Link href="/profile" className="group">
          <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-200 border border-slate-200 group-hover:border-brand/20">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">My Profile</h3>
            <p className="text-sm text-slate-600">View your activity</p>
          </div>
        </Link>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Spots */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand" />
                Popular This Week
              </h2>
              <Link href="/listings" className="text-brand text-sm font-medium hover:underline">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Stevenson Coffee House", rating: 4.5, reviews: 67, category: "Coffee" },
                { name: "Science & Engineering Library", rating: 4.2, reviews: 45, category: "Study" },
                { name: "Porter Meadow", rating: 4.8, reviews: 12, category: "Recreation" }
              ].map((spot, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{spot.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">{spot.rating}</span>
                      </div>
                      <span className="text-sm text-slate-500">({spot.reviews} reviews)</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{spot.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats & Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Reviews Written</span>
                <span className="font-semibold text-brand">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Questions Asked</span>
                <span className="font-semibold text-brand">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Places Visited</span>
                <span className="font-semibold text-brand">8</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Questions</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-slate-900 font-medium">"Best coffee near library?"</p>
                <p className="text-slate-500 text-xs mt-1">3 answers • 2 days ago</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-900 font-medium">"Quiet study spots?"</p>
                <p className="text-slate-500 text-xs mt-1">7 answers • 1 week ago</p>
              </div>
            </div>
            <Link href="/search" className="text-brand text-sm font-medium hover:underline mt-4 inline-block">
              Ask a question →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}