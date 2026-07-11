"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  Wand2,
  Mail,
  User,
  Target,
  PenLine,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

type Tone = "professional" | "friendly" | "casual" | "persuasive" | "formal";

const tones: { value: Tone; label: string; description: string }[] = [
  { value: "professional", label: "Professional", description: "Clean and business-appropriate" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "persuasive", label: "Persuasive", description: "Compelling and action-driven" },
  { value: "formal", label: "Formal", description: "Traditional and structured" },
];

const templates = [
  "Cold Outreach",
  "Follow Up",
  "Partnership Proposal",
  "Re-Engagement",
  "Introduction",
];

const exampleEmails: Record<Tone, string> = {
  professional: `Hi {{name}},

I came across {{company}} and was impressed by the work you're doing in {{industry}}.

We help companies like yours streamline their lead generation process — our clients typically see a 40% increase in qualified pipeline within the first quarter.

Would you be open to a quick 15-minute call this week to explore whether this could work for {{company}}?

Best regards,
Daksh`,
  friendly: `Hey {{name}}!

Hope you're doing well — I noticed {{company}} has been growing fast in {{industry}}. That's awesome.

I work with teams that are scaling their outreach, and I thought of you. We've helped companies cut their prospecting time in half while actually getting more responses.

Mind if I share a quick case study? No pitch, just thought it might be useful.

Cheers,
Daksh`,
  casual: `Hi {{name}},

Quick one — saw what {{company}} is building and wanted to reach out.

We work with {{industry}} companies on their lead gen, and honestly, some of the results have been wild. Thought it might be worth a conversation.

Free this week for a quick chat?

Thanks!
Daksh`,
  persuasive: `{{name}},

Every day {{company}} waits to optimize your lead generation, you're leaving revenue on the table.

Your competitors in {{industry}} are already using AI-powered outreach to close deals faster. Our clients see 3x more meetings booked in the first 30 days.

I'd love to show you exactly how. Can we schedule 15 minutes this week?

This could be the difference between hitting your Q3 targets and falling short.

Talk soon,
Daksh`,
  formal: `Dear {{name}},

I am writing to introduce our services to {{company}}. Having reviewed your position in the {{industry}} sector, I believe there may be significant synergy between our organizations.

Our firm specializes in AI-driven lead generation solutions that have delivered measurable results for companies of similar scale and ambition.

I would welcome the opportunity to present a brief overview at your earliest convenience. Please let me know a suitable time for a preliminary discussion.

Respectfully,
Daksh`,
};

export default function EmailPage() {
  const [recipientName, setRecipientName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [template, setTemplate] = useState("Cold Outreach");
  const [context, setContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated("");

    const base = exampleEmails[tone];
    const filled = base
      .replace(/\{\{name\}\}/g, recipientName || "there")
      .replace(/\{\{company\}\}/g, company || "your company")
      .replace(/\{\{industry\}\}/g, industry || "your industry");

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setGenerated(filled.slice(0, i));
      if (i >= filled.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 12);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTone = tones.find((t) => t.value === tone)!;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Wand2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Email Composer
              </h1>
              <p className="text-sm text-muted-foreground/70">
                AI-powered outreach that sounds like you, not a robot.
              </p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* ─── Left: Settings ─── */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-5 rounded-2xl border border-border/50 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {/* Recipient */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  <User className="h-3.5 w-3.5" />
                  Recipient
                </div>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contact name"
                    className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground/40 focus:border-ring focus:bg-muted/30 focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground/40 focus:border-ring focus:bg-muted/30 focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry"
                    className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground/40 focus:border-ring focus:bg-muted/30 focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Template */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  <Mail className="h-3.5 w-3.5" />
                  Template
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {templates.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                        template === t
                          ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-border"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Tone */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  <PenLine className="h-3.5 w-3.5" />
                  Tone
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowToneDropdown(!showToneDropdown)}
                    className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm transition-all duration-150 hover:bg-muted/40 hover:border-border focus:border-ring focus:ring-1 focus:ring-ring"
                  >
                    <span className="font-medium">{selectedTone.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground/60 transition-transform duration-200",
                        showToneDropdown && "rotate-180"
                      )}
                    />
                  </button>
                  {showToneDropdown && (
                    <div className="absolute top-full z-10 mt-1.5 w-full rounded-xl border border-border/60 bg-card py-1 shadow-lg">
                      {tones.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => {
                            setTone(t.value);
                            setShowToneDropdown(false);
                          }}
                          className={cn(
                            "flex w-full flex-col px-3.5 py-2 text-left transition-colors duration-150 hover:bg-muted/60",
                            t.value === tone && "bg-primary/5"
                          )}
                        >
                          <span className="text-sm font-medium">{t.label}</span>
                          <span className="text-[11px] text-muted-foreground/60">
                            {t.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Context */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  <Target className="h-3.5 w-3.5" />
                  Additional Context
                </div>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Pain points, angles, specifics..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground/40 focus:border-ring focus:bg-muted/30 focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  "flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
                  isGenerating
                    ? "bg-primary/80 text-primary-foreground cursor-wait"
                    : "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 active:scale-[0.98]"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── Right: Preview ─── */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-3.5">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Preview
                  </span>
                  {generated && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {generated.split(/\s+/).length} words
                    </span>
                  )}
                </div>
                {generated && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground/70 transition-all duration-150 hover:bg-muted/60 hover:text-foreground hover:border-border"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Email body */}
              <div className="min-h-[400px] rounded-2xl border border-border/50 bg-card p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                {generated ? (
                  <div className="space-y-0">
                    {/* Subject line */}
                    <div className="mb-6 border-b border-border/30 pb-5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        Subject
                      </span>
                      <p className="mt-1.5 text-lg font-semibold text-foreground">
                        {template} — {company || "Your Company"}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="whitespace-pre-wrap text-[15px] leading-[1.8] text-foreground/80">
                      {generated}
                      {isGenerating && (
                        <span className="ml-0.5 inline-block h-[1.1em] w-px animate-pulse bg-foreground/30 align-text-bottom" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[350px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                      <Mail className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                    <p className="mt-5 text-sm font-medium text-muted-foreground/60">
                      Your email will appear here
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground/40">
                      Fill in the recipient details, choose a tone, and hit
                      generate to see your AI-crafted email.
                    </p>
                  </div>
                )}
              </div>

              {/* Fine-tune hint */}
              {generated && !isGenerating && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/30 py-2.5 text-[11px] text-muted-foreground/50">
                  <Sparkles className="h-3 w-3 text-primary/40" />
                  Adjust settings and regenerate to refine your email
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
