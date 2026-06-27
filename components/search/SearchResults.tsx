"use client";

import { ExternalLink, Globe, MapPin, Users, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-muted-foreground bg-muted border-border";
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
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-muted p-4">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No results yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Search for a business type, industry, or location to discover leads.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Results header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{results.length}</span>{" "}
          companies found
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {results.map((company) => (
          <div
            key={company.id}
            className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: company.logoColor }}
              >
                {company.logoInitial}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {/* Name + Website */}
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {company.name}
                      </h3>
                      <a
                        href={`https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Industry */}
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>

                  {/* AI Score */}
                  <div
                    className={cn(
                      "flex flex-col items-center rounded-lg border px-3 py-1.5",
                      getScoreColor(company.aiScore)
                    )}
                  >
                    <span className="text-lg font-bold leading-none">
                      {company.aiScore}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide opacity-70">
                      {getScoreLabel(company.aiScore)}
                    </span>
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {company.employees}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {company.revenue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    {company.website}
                  </span>
                </div>

                {/* Actions */}
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
                    className="h-8 text-xs text-muted-foreground"
                    onClick={() => onSave?.(company.id)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
