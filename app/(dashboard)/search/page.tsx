"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import { SearchResults } from "@/components/search/SearchResults";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";
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
    revenue: "$2.7M annual",
    location: "Austin, TX",
    website: "bartonspringsdental.com",
    aiScore: 71,
    logoColor: "#6D28D9",
    logoInitial: "BD",
  },
];

const suggestedItems = [
  { label: "Dentists", emoji: "🦷" },
  { label: "Law Firms", emoji: "⚖️" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "SaaS", emoji: "💻" },
  { label: "Agencies", emoji: "🎯" },
  { label: "Clinics", emoji: "🏥" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult] = useState<typeof mockResults[0] | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  const handleSuggestedSearch = (label: string) => {
    setQuery(label);
    handleSearch();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-7rem)]">
      {/* Search Hero */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <FadeIn y={20}>
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Find Your Next Client
                </h1>
                <p className="mt-4 text-lg text-muted-foreground/70">
                  Search by industry, location, or company name to discover qualified leads
                </p>
              </div>

              <FadeIn delay={0.1} y={10}>
                <div className="relative">
                  <div
                    className={cn(
                      "relative flex items-center rounded-2xl border bg-card p-2 transition-all duration-300",
                      "border-border/60 shadow-md hover:shadow-lg hover:border-border"
                    )}
                  >
                    <div className="flex h-14 items-center pl-4">
                      <Search className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search companies, industries, locations..."
                        className="w-full bg-transparent px-4 text-lg outline-none"
                      />
                    </div>
                    <m.button
                      onClick={handleSearch}
                      disabled={!query.trim() || isSearching}
                      whileHover={query.trim() && !isSearching && !prefersReducedMotion ? { scale: 1.02 } : undefined}
                      whileTap={query.trim() && !isSearching && !prefersReducedMotion ? { scale: 0.98 } : undefined}
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200 cursor-pointer",
                        query.trim() && !isSearching
                          ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                      {isSearching ? "Searching..." : "Search"}
                    </m.button>
                  </div>
                </div>
              </FadeIn>

              <FadeInStagger stagger={0.05} delay={0.2}>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <span className="text-xs text-muted-foreground/60">Try:</span>
                  {suggestedItems.map((item) => (
                    <FadeInStaggerItem key={item.label}>
                      <m.button
                        onClick={() => handleSuggestedSearch(item.label)}
                        whileHover={
                          !prefersReducedMotion
                            ? { scale: 1.04, borderColor: "rgba(var(--primary), 0.3)" }
                            : undefined
                        }
                        whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
                        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground hover:shadow-sm cursor-pointer"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </m.button>
                    </FadeInStaggerItem>
                  ))}
                </div>
              </FadeInStagger>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pb-12">
        <SearchResults
          results={results}
          onResearch={(id) => console.log("Research:", id)}
          onGenerateEmail={(id) => console.log("Generate email:", id)}
          onSave={(id) => console.log("Save:", id)}
        />
      </div>
    </div>
  );
}