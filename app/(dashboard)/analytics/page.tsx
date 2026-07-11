"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  company: string;
  value: number;
  priority: "high" | "medium" | "low";
  stage: string;
}

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"] as const;

const priorityConfig = {
  high: { label: "High", dot: "bg-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200/60 dark:border-rose-900/60" },
  medium: { label: "Medium", dot: "bg-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200/60 dark:border-amber-900/60" },
  low: { label: "Low", dot: "bg-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200/60 dark:border-emerald-900/60" },
} as const;

const stageDotColors: Record<string, string> = {
  Lead: "bg-slate-400",
  Qualified: "bg-blue-400",
  Proposal: "bg-violet-400",
  Negotiation: "bg-amber-400",
  "Closed Won": "bg-emerald-400",
};

const deals: Deal[] = [
  { id: "1", company: "Acme Corp", value: 24000, priority: "high", stage: "Negotiation" },
  { id: "2", company: "TechStart Inc", value: 18500, priority: "medium", stage: "Proposal" },
  { id: "3", company: "Global Solutions", value: 42000, priority: "high", stage: "Closed Won" },
  { id: "4", company: "Nexus Digital", value: 9800, priority: "low", stage: "Lead" },
  { id: "5", company: "Pinnacle Labs", value: 31000, priority: "high", stage: "Qualified" },
  { id: "6", company: "Vantage Point", value: 15200, priority: "medium", stage: "Negotiation" },
  { id: "7", company: "Clearview AI", value: 67000, priority: "high", stage: "Proposal" },
  { id: "8", company: "Horizon Media", value: 8400, priority: "low", stage: "Lead" },
  { id: "9", company: "Atlas Ventures", value: 22500, priority: "medium", stage: "Qualified" },
  { id: "10", company: "Meridian Health", value: 53000, priority: "high", stage: "Negotiation" },
  { id: "11", company: "BlueSky Analytics", value: 12000, priority: "low", stage: "Proposal" },
  { id: "12", company: "Summit Partners", value: 38500, priority: "medium", stage: "Closed Won" },
];

function formatValue(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `$${value}`;
}

function DealCard({ deal }: { deal: Deal }) {
  const p = priorityConfig[deal.priority];

  return (
    <div className="group rounded-2xl border border-border/50 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-border/80 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground">
          {deal.company}
        </h3>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
            p.bg,
            p.text,
            p.border
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />
          {p.label}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {formatValue(deal.value)}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70">
          <span className={cn("h-2 w-2 rounded-full", stageDotColors[deal.stage])} />
          {deal.stage}
        </span>
      </div>
    </div>
  );
}

function PipelineColumn({
  stage,
  deals,
}: {
  stage: string;
  deals: Deal[];
}) {
  const total = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex min-w-[280px] flex-1 flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 pb-5">
        <div className="flex items-center gap-2.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", stageDotColors[stage])} />
          <h2 className="text-sm font-semibold text-foreground">{stage}</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted/80 px-1.5 text-[11px] font-medium text-muted-foreground/70">
            {deals.length}
          </span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground/50">
          {formatValue(total)}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}

        {deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/40 py-12">
            <p className="text-sm text-muted-foreground/40">No deals</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
  }));

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deal Pipeline</h1>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {deals.length} active deals · {formatValue(totalValue)} total value
            </p>
          </div>
        </div>

        {/* Pipeline */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {dealsByStage.map(({ stage, deals: stageDeals }) => (
            <PipelineColumn key={stage} stage={stage} deals={stageDeals} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
