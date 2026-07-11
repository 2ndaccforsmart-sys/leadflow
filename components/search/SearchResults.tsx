"use client";

import { ExternalLink, Globe, MapPin, Users, Building2, TrendingUp } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: string;
  revenue: string;
  location: string;
  website: string;
  aiScore: number;
  logoColor: string;
  logoInitial: string;
}

interface SearchResultsProps {
  results: Company[];
  onResearch?: (id: string) => void;
  onGenerateEmail?: (id: string) => void;
  onSave?: (id: string) => void;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200/60";
  if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200/60";
  if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200/60";
  return "text-muted-foreground bg-muted border-border/60";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Good";
  return "Fair";
}

export function SearchResults({
  results,
  onResearch,
  onGenerateEmail,
  onSave,
}: SearchResultsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-muted/60 p-4">
          <Building2 className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground/80">
          No leads found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground/60">
          Enter a different query or location.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Results header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-muted-foreground/70">
          <span className="font-semibold text-foreground">{results.length}</span>{" "}
          companies found
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        {results.map((company, index) => (
          <ScrollReveal key={company.id} delay={index * 0.05} amount={0.1}>
            <m.div
              className="group relative rounded-2xl border border-border/50 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-border/80"
              whileHover={
                !prefersReducedMotion
                  ? { y: -1 }
                  : undefined
              }
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
                  style={{ backgroundColor: company.logoColor }}
                >
                  {company.logoInitial}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold text-foreground">
                          {company.name}
                        </h3>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="mt-0.5 text-[13px] text-muted-foreground/70">
                        {company.industry}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex flex-col items-center rounded-xl border px-3 py-1.5",
                        getScoreColor(company.aiScore)
                      )}
                    >
                      <span className="text-lg font-bold leading-none">
                        {company.aiScore}
                      </span>
                      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-60">
                        {getScoreLabel(company.aiScore)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground/60">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {company.employees}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" />
                      {company.revenue}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {company.website}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 text-xs"
                      onClick={() => onResearch?.(company.id)}
                    >
                      Research
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => onGenerateEmail?.(company.id)}
                    >
                      Generate Email
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-muted-foreground/70"
                      onClick={() => onSave?.(company.id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </m.div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
