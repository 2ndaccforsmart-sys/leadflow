"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
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
  const prefersReducedMotion = useReducedMotion();

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowResults(true);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-7rem)] flex-col">
        {!showResults && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-2xl space-y-10">
              <FadeIn delay={0} y={10} className="text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Find your next lead
                </h1>
                <p className="mt-2.5 text-sm text-muted-foreground/70">
                  Search for any business, industry, or location.
                </p>
              </FadeIn>

              <FadeIn delay={0.1} y={14}>
                <div className="relative">
                  <div className="relative flex items-center rounded-2xl border border-border/60 bg-card p-2 shadow-md transition-all duration-300 hover:shadow-lg hover:border-border">
                    <div className="flex h-12 items-center pl-4">
                      <Search className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Dentists in Austin, Law firms in NYC..."
                      className="flex-1 bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground/50"
                    />
                    <m.button
                      onClick={handleSearch}
                      whileHover={
                        searchValue && !prefersReducedMotion
                          ? { scale: 1.02 }
                          : undefined
                      }
                      whileTap={
                        searchValue && !prefersReducedMotion
                          ? { scale: 0.98 }
                          : undefined
                      }
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200",
                        searchValue
                          ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                      Search
                    </m.button>
                  </div>
                </div>
              </FadeIn>

              <FadeInStagger stagger={0.05} delay={0.2}>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <span className="text-xs text-muted-foreground/60">Try:</span>
                  {suggestedSearches.map((item) => (
                    <FadeInStaggerItem key={item.label}>
                      <m.button
                        onClick={() => {
                          setSearchValue(item.label.toLowerCase());
                          setShowResults(true);
                        }}
                        whileHover={
                          !prefersReducedMotion
                            ? { scale: 1.04 }
                            : undefined
                        }
                        whileTap={
                          !prefersReducedMotion ? { scale: 0.97 } : undefined
                        }
                        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground hover:shadow-sm"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </m.button>
                    </FadeInStaggerItem>
                  ))}
                </div>
              </FadeInStagger>
            </div>
          </div>
        )}

        {showResults && (
          <div className="mx-auto w-full max-w-4xl py-6">
            <FadeIn delay={0} y={6} className="mb-6">
              <div className="relative">
                <div className="flex items-center rounded-xl border border-border/60 bg-card p-2 shadow-sm transition-all duration-200 focus-within:shadow-md focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                  <div className="flex h-10 items-center pl-3">
                    <Search className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Dentists in Austin, Law firms in NYC..."
                    className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/50"
                  />
                  <m.button
                    onClick={handleSearch}
                    whileHover={!prefersReducedMotion ? { scale: 1.02 } : undefined}
                    whileTap={!prefersReducedMotion ? { scale: 0.98 } : undefined}
                    className={cn(
                      "flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-all duration-200",
                      searchValue
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Search
                  </m.button>
                </div>
              </div>
            </FadeIn>

            <SearchResults
              results={mockResults}
              onResearch={(id) => console.log("Research:", id)}
              onGenerateEmail={(id) => console.log("Generate email:", id)}
              onSave={(id) => console.log("Save:", id)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
