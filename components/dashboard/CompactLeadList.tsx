"use client";

import { MapPin, Building2, ExternalLink } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  aiScore: number;
  logoColor: string;
  logoInitial: string;
}

interface CompactLeadListProps {
  leads: Lead[];
  query: string;
}

export function CompactLeadList({ leads, query }: CompactLeadListProps) {
  const prefersReducedMotion = useReducedMotion();

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted/60 p-3">
          <Building2 className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <h3 className="mt-3 text-sm font-medium text-foreground/80">
          No leads found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Try a different search term{query ? ` for "${query}"` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground/60 px-1">
        <span className="font-semibold text-foreground/80">{leads.length}</span>{" "}
        leads found
      </p>

      <div className="divide-y divide-border/40 rounded-xl border border-border/50 bg-card">
        {leads.map((lead, index) => (
          <m.div
            key={lead.id}
            initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: lead.logoColor }}
            >
              {lead.logoInitial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {lead.name}
                </span>
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                <span>{lead.industry}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.location}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {lead.aiScore}
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}
