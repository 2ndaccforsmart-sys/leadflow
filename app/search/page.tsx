"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchResults } from "@/components/search/SearchResults";
import { cn } from "@/lib/utils";

const mockResults = [
  {
    id: "1",
    name: "Smile Bright Dental",
    industry: "Dental Practice",
    employees: "12 employees",
    revenue: "$2.4M annual",
    location: "Austin, TX",
    website: "smilebrightdental.com",
    aiScore: 94,
    logoColor: "#6366F1",
    logoInitial: "SB",
  },
  {
    id: "2",
    name: "ClearView Orthodontics",
    industry: "Orthodontics",
    employees: "8 employees",
    revenue: "$1.8M annual",
    location: "Austin, TX",
    website: "clearviewortho.com",
    aiScore: 88,
    logoColor: "#8B5CF6",
    logoInitial: "CV",
  },
  {
    id: "3",
    name: "Pecan Street Dental",
    industry: "General Dentistry",
    employees: "15 employees",
    revenue: "$3.1M annual",
    location: "Austin, TX",
    website: "pecanstreetdental.com",
    aiScore: 82,
    logoColor: "#A78BFA",
    logoInitial: "PS",
  },
  {
    id: "4",
    name: "Lone Star Oral Surgery",
    industry: "Oral Surgery",
    employees: "6 employees",
    revenue: "$1.2M annual",
    location: "Austin, TX",
    website: "lonestaroral.com",
    aiScore: 76,
    logoColor: "#7C3AED",
    logoInitial: "LS",
  },
  {
    id: "5",
    name: "Barton Springs Dental",
    industry: "Cosmetic Dentistry",
    employees: "10 employees",
    revenue: "$2.0M annual",
    location: "Austin, TX",
    website: "bartonspringsdental.com",
    aiScore: 71,
    logoColor: "#5B21B6",
    logoInitial: "BS",
  },
];

const suggestedSearches = [
  { label: "Dentists", emoji: "🦷" },
  { label: "Law Firms", emoji: "⚖️" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "SaaS", emoji: "💻" },
  { label: "Agencies", emoji: "🎯" },
  { label: "Clinics", emoji: "🏥" },
];

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowResults(true);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find potential leads by keyword, location, or industry.
          </p>
        </div>

        {/* Search box */}
        <div className="relative mb-8">
          <div className="flex items-center rounded-xl border border-border bg-card p-2 shadow-sm transition-shadow duration-200 focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring">
            <div className="flex h-10 items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Dentists in Austin, Law firms in NYC..."
              className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={handleSearch}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg px-4 text-xs font-medium transition-all duration-200",
                searchValue
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Search
            </button>
          </div>
        </div>

        {/* Suggested searches */}
        {!showResults && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {suggestedSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setSearchValue(item.label.toLowerCase());
                  setShowResults(true);
                }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <SearchResults
            results={mockResults}
            onResearch={(id) => console.log("Research:", id)}
            onGenerateEmail={(id) => console.log("Generate email:", id)}
            onSave={(id) => console.log("Save:", id)}
          />
        )}
      </div>
    </AppLayout>
  );
}
