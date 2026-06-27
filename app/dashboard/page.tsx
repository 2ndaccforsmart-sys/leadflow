"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { getGreeting, getTimeIcon } from "@/lib/greetings";
import { cn } from "@/lib/utils";

const suggestedSearches = [
  { label: "Dentists", emoji: "🦷" },
  { label: "Law Firms", emoji: "⚖️" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "SaaS", emoji: "💻" },
  { label: "Agencies", emoji: "🎯" },
  { label: "Clinics", emoji: "🏥" },
];

export default function DashboardPage() {
  const userName = "Daksh";
  const [searchValue, setSearchValue] = useState("");

  const { greeting, action } = useMemo(
    () => getGreeting(userName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const timeIcon = getTimeIcon();

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-10">
          {/* Greeting */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {greeting} {timeIcon}
            </p>
          </div>

          {/* Hero heading */}
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Who are we finding today?
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Search for any business, industry, or location to discover leads.
            </p>
          </div>

          {/* Search box */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-center rounded-2xl border border-border bg-card p-2 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="flex h-12 items-center pl-4">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Dentists in Austin, Law firms in NYC..."
                className="flex-1 bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground/60"
              />
              <button
                className={cn(
                  "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200",
                  searchValue
                    ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Sparkles className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          {/* Suggested searches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {suggestedSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => setSearchValue(item.label.toLowerCase())}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
