"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  Calendar,
  Bookmark,
  Mail,
  ExternalLink,
  Sparkles,
  Building2,
  Newspaper,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LeadData {
  id: string;
  company: string;
  domain: string;
  location: string;
  employees: string;
  founded: string;
  industry: string;
  description: string;
  logoColor: string;
  logoInitials: string;
  aiSummary: string;
  news: {
    title: string;
    source: string;
    date: string;
    url: string;
  }[];
}

const mockLeads: Record<string, LeadData> = {
  "1": {
    id: "1",
    company: "Acme Corp",
    domain: "acmecorp.com",
    location: "San Francisco, CA",
    employees: "250–500",
    founded: "2015",
    industry: "Enterprise Software",
    description:
      "Acme Corp builds collaborative project management tools for distributed teams. Their platform serves over 2,000 businesses worldwide, with a focus on mid-market companies seeking to streamline cross-functional workflows.",
    logoColor: "from-blue-500 to-indigo-600",
    logoInitials: "AC",
    aiSummary:
      "Acme Corp is a growth-stage SaaS company with strong retention metrics and expanding into enterprise segments. They recently raised a Series C and are actively hiring across engineering and sales. Their tech stack suggests they may be evaluating new tools for developer productivity and internal communications — a strong fit for outbound outreach.",
    news: [
      {
        title: "Acme Corp Raises $45M Series C to Expand Platform",
        source: "TechCrunch",
        date: "2 days ago",
        url: "#",
      },
      {
        title: "How Acme Corp Is Redefining Remote Collaboration",
        source: "Forbes",
        date: "1 week ago",
        url: "#",
      },
      {
        title: "Acme Corp Named in Top 50 SaaS Companies to Watch",
        source: "SaaStr",
        date: "3 weeks ago",
        url: "#",
      },
    ],
  },
};

function getLead(id: string): LeadData {
  return (
    mockLeads[id] || {
      id,
      company: "Company #" + id,
      domain: "example.com",
      location: "Unknown",
      employees: "N/A",
      founded: "N/A",
      industry: "Unknown",
      description: "No information available for this lead.",
      logoColor: "from-slate-400 to-slate-500",
      logoInitials: "??",
      aiSummary: "No AI summary available.",
      news: [],
    }
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const lead = getLead(id);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-12 pb-16">
        {/* Back link */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to search
        </Link>

        {/* ─── Company Header ─── */}
        <div className="flex items-start gap-5">
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white shadow-lg",
              lead.logoColor
            )}
          >
            {lead.logoInitials}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {lead.company}
              </h1>
              <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {lead.industry}
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {lead.domain}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {lead.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {lead.employees}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Founded {lead.founded}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-2.5">
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
                <Mail className="h-4 w-4" />
                Generate Email
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                  saved
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border/60 bg-card text-foreground hover:bg-muted/60 hover:border-border"
                )}
              >
                <Bookmark
                  className={cn("h-4 w-4", saved && "fill-primary")}
                />
                {saved ? "Saved" : "Save Lead"}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Overview ─── */}
        <section>
          <div className="flex items-center gap-2.5 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground/70" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Overview</h2>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[15px] leading-[1.7] text-muted-foreground/80">
              {lead.description}
            </p>
          </div>
        </section>

        {/* ─── AI Summary ─── */}
        <section>
          <div className="flex items-center gap-2.5 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              AI Summary
            </h2>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
            <p className="text-[15px] leading-[1.7] text-foreground/75">
              {lead.aiSummary}
            </p>
          </div>
        </section>

        {/* ─── Recent News ─── */}
        <section>
          <div className="flex items-center gap-2.5 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80">
              <Newspaper className="h-3.5 w-3.5 text-muted-foreground/70" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Recent News
            </h2>
          </div>
          <div className="space-y-2.5">
            {lead.news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                className="group flex items-start gap-3.5 rounded-2xl border border-border/50 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-border/80"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground/60 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <span>{item.source}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/20 transition-colors group-hover:text-primary/40" />
              </a>
            ))}

            {lead.news.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/40 py-10 text-center">
                <p className="text-sm text-muted-foreground/40">
                  No recent news found
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
