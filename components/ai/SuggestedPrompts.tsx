"use client";

import {
  Building2,
  Mail,
  Search,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  {
    icon: Building2,
    label: "Find companies",
    prompt: "Find dental practices in Austin with 10+ employees",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Mail,
    label: "Draft outreach",
    prompt: "Write a cold email for a dental supply company",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: TrendingUp,
    label: "Analyze market",
    prompt: "What's the market size for dental services in Texas?",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Users,
    label: "Research contacts",
    prompt: "Find decision makers at Smile Bright Dental",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Search,
    label: "Competitor intel",
    prompt: "Compare pricing of top dental clinics in Austin",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: Globe,
    label: "Industry trends",
    prompt: "What are the latest trends in dental technology?",
    color: "text-cyan-600 bg-cyan-50",
  },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {prompts.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.prompt)}
          className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-left text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.color}`}
          >
            <item.icon className="h-3.5 w-3.5" />
          </div>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
