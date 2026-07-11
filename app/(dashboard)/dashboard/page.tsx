"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";
import { getGreeting, getTimeIcon } from "@/lib/greetings";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const placeholderTexts = [
  "Dentists in Austin",
  "Law firms in NYC",
  "Restaurants in LA",
  "SaaS startups",
  "Agencies in London",
  "Dental clinics in Miami",
];

const suggestedSearches = [
  { label: "Dentists", emoji: "🦷" },
  { label: "Law Firms", emoji: "⚖️" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "SaaS", emoji: "💻" },
  { label: "Agencies", emoji: "🎯" },
  { label: "Clinics", emoji: "🏥" },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [removeBlob, setRemoveBlob] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [displayText, setDisplayText] = useState(placeholderTexts[0]);
  const textRef = useRef("");
  const indexRef = useRef(0);
  const deletingRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    async function fetchProfile() {
      // Use getSession() first - reads from localStorage instantly, no network request
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, company_name, avatar_url")
          .eq("id", user.id)
          .single();

        // Calculate greeting ONCE when profile resolves
        const name = profileData?.name || user.email?.split("@")[0] || "User";
        const { greeting: timeGreeting, action } = getGreeting(name);
        setGreeting(`${timeGreeting} ${action}`);
      } else {
        // Mock user fallback for greeting when no session
        const { greeting: timeGreeting, action } = getGreeting("Thanki");
        setGreeting(`${timeGreeting} ${action}`);
      }
      setLoading(false);
    }

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, company_name, avatar_url")
          .eq("id", user.id)
          .single();

        const name = profileData?.name || user.email?.split("@")[0] || "User";
        const { greeting: timeGreeting, action } = getGreeting(name);
        setGreeting(`${timeGreeting} ${action}`);
      } else {
        // Mock user fallback when no session
        const { greeting: timeGreeting, action } = getGreeting("Thanki");
        setGreeting(`${timeGreeting} ${action}`);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Read blob setting
  useEffect(() => {
    try {
      const stored = localStorage.getItem("settings_remove_blob");
      if (stored !== null) {
        setRemoveBlob(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number;
    const typeInterval = 65;
    const deleteInterval = 35;
    const pauseDuration = 2000;

    function tick(now: number) {
      const elapsed = now - lastTimeRef.current;
      const current = placeholderTexts[indexRef.current];

      if (!deletingRef.current) {
        if (textRef.current.length < current.length) {
          if (elapsed >= typeInterval) {
            textRef.current = current.slice(0, textRef.current.length + 1);
            setDisplayText(textRef.current);
            lastTimeRef.current = now;
          }
          rafId = requestAnimationFrame(tick);
        } else {
          if (elapsed >= pauseDuration) {
            deletingRef.current = true;
            lastTimeRef.current = now;
          }
          rafId = requestAnimationFrame(tick);
        }
      } else {
        if (textRef.current.length > 0) {
          if (elapsed >= deleteInterval) {
            textRef.current = textRef.current.slice(0, -1);
            setDisplayText(textRef.current);
            lastTimeRef.current = now;
          }
          rafId = requestAnimationFrame(tick);
        } else {
          deletingRef.current = false;
          indexRef.current = (indexRef.current + 1) % placeholderTexts.length;
          lastTimeRef.current = now;
          rafId = requestAnimationFrame(tick);
        }
      }
    }

    lastTimeRef.current = performance.now();
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  const timeIcon = getTimeIcon();

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSuggestedSearch = (label: string) => {
    router.push(`/search?q=${encodeURIComponent(label)}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SpotlightCard className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center" size={160} opacity={0.8} removeBlob={removeBlob}>
      <div className="w-full max-w-2xl space-y-12">
        <FadeIn delay={0} y={8} className="text-center">
          <p className="text-base text-muted-foreground">
            {greeting} {timeIcon}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} y={12} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Who are we finding today?
          </h1>
          <p className="mt-3 text-base text-muted-foreground/80">
            Search for any business, industry, or location to discover leads.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={16}>
          <div className="relative group">
            <div
              className={cn(
                "relative flex items-center rounded-2xl border bg-card p-2 transition-all duration-300",
                isInputFocused
                  ? "border-ring shadow-lg ring-1 ring-ring"
                  : "border-border/60 shadow-md hover:shadow-lg hover:border-border"
              )}
            >
              <div className="flex h-12 items-center pl-4">
                <Search className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder=""
                  className="w-full bg-transparent px-4 text-base outline-none"
                />
                {!searchValue && (
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-muted-foreground/50">
                    {displayText}
                    <span className="ml-px inline-block w-px animate-pulse bg-muted-foreground/50" style={{ height: "1.1em", verticalAlign: "text-bottom" }} />
                  </span>
                )}
              </div>
              <m.button
                onClick={handleSearch}
                disabled={!searchValue.trim()}
                whileHover={searchValue.trim() && !prefersReducedMotion ? { scale: 1.02 } : undefined}
                whileTap={searchValue.trim() && !prefersReducedMotion ? { scale: 0.98 } : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200 cursor-pointer",
                  searchValue.trim()
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

        <FadeInStagger stagger={0.05} delay={0.35}>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-xs text-muted-foreground/60">Try:</span>
            {suggestedSearches.map((item) => (
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
    </SpotlightCard>
  );
}