"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, TrendingUp, Clock, Users } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

type Question = {
  id: string;
  question: string;
  category: string;
  upvotes: number;
  answers: number;
  created_at: string;
  author: string;
};

const trendingQuestions: Question[] = [
  {
    id: "1",
    question: "Best coffee shop for studying near campus?",
    category: "Coffee",
    upvotes: 24,
    answers: 8,
    created_at: "2024-01-15",
    author: "Sarah M."
  },
  {
    id: "2", 
    question: "Where can I find good late-night food options?",
    category: "Food",
    upvotes: 18,
    answers: 12,
    created_at: "2024-01-14",
    author: "Mike K."
  },
  {
    id: "3",
    question: "Quiet study spots that are open 24/7?",
    category: "Study",
    upvotes: 31,
    answers: 6,
    created_at: "2024-01-13",
    author: "Alex R."
  },
  {
    id: "4",
    question: "Best places for group meetings on campus?",
    category: "Study",
    upvotes: 15,
    answers: 9,
    created_at: "2024-01-12",
    author: "Emma L."
  }
];

const popularSearches = [
  "Coffee shops near library",
  "Study rooms with whiteboards", 
  "Late night dining",
  "Printing services",
  "Quiet outdoor spots",
  "Group study areas"
];

function SearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [questions, setQuestions] = useState<Question[]>(trendingQuestions);

  const categories = [
    { key: "all", label: "All", icon: "🔍" },
    { key: "coffee", label: "Coffee", icon: "☕" },
    { key: "study", label: "Study", icon: "📚" },
    { key: "food", label: "Food", icon: "🍽️" },
    { key: "services", label: "Services", icon: "🏢" },
    { key: "events", label: "Events", icon: "🎉" }
  ];

  const filteredQuestions = selectedCategory === "all" 
    ? questions 
    : questions.filter(q => q.category.toLowerCase() === selectedCategory);

  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Search & Ask Questions
          </h1>
          <p className="text-slate-600">
            Find answers from the UCSC community or ask your own questions
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Ask anything about campus life..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg border-none outline-none placeholder-slate-400"
            />
            <button className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
              Search
            </button>
          </div>
          
          {/* Popular Searches */}
          <div>
            <p className="text-sm text-slate-600 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(search)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card">
              <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === cat.key
                        ? 'bg-brand text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand" />
                Trending Questions
              </h2>
              <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                Ask Question
              </button>
            </div>

            {filteredQuestions.map(question => (
              <div key={question.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-medium text-slate-900 flex-1 mr-4">
                    {question.question}
                  </h3>
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                    {question.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {question.upvotes} upvotes
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {question.answers} answers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>by {question.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><div className="text-center">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}