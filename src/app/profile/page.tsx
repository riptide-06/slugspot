"use client";

import { useEffect, useState } from "react";
import { User, Star, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import Avatar from "@/components/Avatar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/lib/supabaseClient";

type UserStats = {
  reviewsCount: number;
  questionsCount: number;
  bookingsCount: number;
  points: number;
  level: number;
};

type Activity = {
  id: string;
  type: 'review' | 'question' | 'booking';
  title: string;
  date: string;
  rating?: number;
};

const badges = [
  { id: 'reviewer', name: 'Active Reviewer', description: 'Left 10+ reviews', icon: '⭐', earned: true },
  { id: 'explorer', name: 'Campus Explorer', description: 'Visited 20+ locations', icon: '🗺️', earned: true },
  { id: 'helper', name: 'Community Helper', description: 'Answered 5+ questions', icon: '🤝', earned: false },
  { id: 'early-bird', name: 'Early Bird', description: 'First 100 users', icon: '🐦', earned: true },
  { id: 'social', name: 'Social Butterfly', description: 'Made 50+ connections', icon: '🦋', earned: false },
  { id: 'expert', name: 'Local Expert', description: 'Top contributor', icon: '👑', earned: false }
];

const sampleActivities: Activity[] = [
  {
    id: '1',
    type: 'review',
    title: 'Reviewed Stevenson Coffee House',
    date: '2024-01-15',
    rating: 5
  },
  {
    id: '2',
    type: 'question',
    title: 'Asked about late-night study spots',
    date: '2024-01-14'
  },
  {
    id: '3',
    type: 'booking',
    title: 'Booked tutoring session',
    date: '2024-01-13'
  },
  {
    id: '4',
    type: 'review',
    title: 'Reviewed Science & Engineering Library',
    date: '2024-01-12',
    rating: 4
  }
];

export default function ProfilePage() {
  const { user } = useAuthUser();
  const [stats, setStats] = useState<UserStats>({
    reviewsCount: 12,
    questionsCount: 3,
    bookingsCount: 5,
    points: 850,
    level: 3
  });
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently';

  const levelProgress = (stats.points % 300) / 300 * 100; // 300 points per level
  const nextLevelPoints = (stats.level * 300) - stats.points;

  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card mb-8">
          <div className="flex items-start gap-6">
            <Avatar name={displayName} size={80} />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
              <p className="text-slate-600 mt-1">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-2">Member since {joinDate}</p>
              
              {/* Level & Points */}
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-slate-700">Level {stats.level}</span>
                  <span className="text-xs text-slate-500">{stats.points} points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-brand h-2 rounded-full transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {nextLevelPoints} points to level {stats.level + 1}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card text-center">
                <Star className="w-8 h-8 text-brand mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{stats.reviewsCount}</div>
                <div className="text-sm text-slate-600">Reviews</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card text-center">
                <MessageSquare className="w-8 h-8 text-brand mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{stats.questionsCount}</div>
                <div className="text-sm text-slate-600">Questions</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card text-center">
                <Calendar className="w-8 h-8 text-brand mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{stats.bookingsCount}</div>
                <div className="text-sm text-slate-600">Bookings</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'question' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'review' ? <Star className="w-5 h-5" /> :
                       activity.type === 'question' ? <MessageSquare className="w-5 h-5" /> :
                       <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    {activity.rating && (
                      <div className="text-yellow-500">
                        {'★'.repeat(activity.rating)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand" />
                Badges
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {badges.map(badge => (
                  <div key={badge.id} className={`p-3 rounded-lg border-2 text-center ${
                    badge.earned 
                      ? 'border-brand bg-brand/5' 
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}>
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium text-slate-900">{badge.name}</div>
                    <div className="text-xs text-slate-600 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                  <div className="font-medium text-slate-900">Edit Profile</div>
                  <div className="text-sm text-slate-600">Update your information</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                  <div className="font-medium text-slate-900">Privacy Settings</div>
                  <div className="text-sm text-slate-600">Manage your privacy</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                  <div className="font-medium text-slate-900">Notification Settings</div>
                  <div className="text-sm text-slate-600">Control notifications</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}