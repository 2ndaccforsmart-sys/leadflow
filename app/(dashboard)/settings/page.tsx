"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const NUDGE_OPTIONS = ["Off", "5m", "15m", "30m", "60m", "3h", "12h", "24h"] as const;

function useSetting<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // ignore parse errors
    }
  }, [key]);

  const update = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  return [value, update];
}

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
  onDetailToggle?: () => void;
  detailOpen?: boolean;
}

function SettingRow({ label, description, children, onDetailToggle, detailOpen }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {onDetailToggle && (
            <button
              onClick={onDetailToggle}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              {detailOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>
      </div>
      <div className="flex-shrink-0 flex items-center">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="border-t border-border/40 px-5 py-3">
        {children}
      </div>
    </div>
  );
}

function SettingsDivider() {
  return <div className="h-px bg-border/40 my-1 last:hidden" />;
}

export default function SettingsPage() {
  const [aiSuggestions, setAiSuggestions] = useSetting("settings_ai_suggestions", true);
  const [aiAssistant, setAiAssistant] = useSetting("settings_ai_assistant", true);
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [autoResearch, setAutoResearch] = useSetting("settings_auto_research", true);
  const [emailDrafts, setEmailDrafts] = useSetting("settings_email_drafts", true);
  const [webSearch, setWebSearch] = useSetting("settings_web_search", true);
  const [aiNudges, setAiNudges] = useSetting<string>("settings_ai_nudges", "Off");
  const [researchAlerts, setResearchAlerts] = useSetting("settings_research_alerts", true);
  const [newMatchAlerts, setNewMatchAlerts] = useSetting("settings_new_match_alerts", false);
  const [activityPanel, setActivityPanel] = useSetting("settings_activity_panel", true);
  const [compactMode, setCompactMode] = useSetting("settings_compact_mode", false);
  const [removeBlob, setRemoveBlob] = useSetting("settings_remove_blob", false);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Manage your preferences and configuration.
        </p>
      </div>

      {/* ── AI & Automation ── */}
      <SectionCard title="AI & Automation">
        <SettingRow
          label="AI Suggestions"
          description="Show AI-powered suggestions in search"
          onDetailToggle={() => setShowAiDetails(!showAiDetails)}
          detailOpen={showAiDetails}
        >
          <Switch checked={aiSuggestions} onCheckedChange={setAiSuggestions} />
        </SettingRow>

        {showAiDetails && (
          <div className="ml-6 pl-3 border-l-2 border-border/40">
            <SettingRow
              label="AI Assistant"
              description="Enable AI opinions in the assistant tab"
            >
              <Switch checked={aiAssistant} onCheckedChange={setAiAssistant} />
            </SettingRow>
          </div>
        )}

        <SettingsDivider />

        <SettingRow
          label="Auto-Research"
          description="Automatically research leads when you save them"
        >
          <Switch checked={autoResearch} onCheckedChange={setAutoResearch} />
        </SettingRow>

        <SettingsDivider />

        <SettingRow
          label="Email Drafts"
          description="Auto-generate email drafts from saved lead data"
        >
          <Switch checked={emailDrafts} onCheckedChange={setEmailDrafts} />
        </SettingRow>

        <SettingsDivider />

        <SettingRow
          label="Web Search"
          description="Allow the assistant to search the web for answers"
        >
          <Switch checked={webSearch} onCheckedChange={setWebSearch} />
        </SettingRow>
      </SectionCard>

      {/* ── AI Nudges ── */}
      <SectionCard title="AI Nudges">
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground">AI Nudges</span>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              Casual reminders to get you back to finding leads
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {NUDGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setAiNudges(opt)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer",
                  aiNudges === opt
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard title="Notifications">
        <SettingRow
          label="Research Alerts"
          description="Notify you when background research completes"
        >
          <Switch checked={researchAlerts} onCheckedChange={setResearchAlerts} />
        </SettingRow>

        <SettingsDivider />

        <SettingRow
          label="New Match Alerts"
          description="Notify you when new leads match your searches"
        >
          <Switch checked={newMatchAlerts} onCheckedChange={setNewMatchAlerts} />
        </SettingRow>
      </SectionCard>

      {/* ── Display ── */}
      <SectionCard title="Display">
        <SettingRow
          label="Activity Panel"
          description="Show the activity panel on the right side"
        >
          <Switch checked={activityPanel} onCheckedChange={setActivityPanel} />
        </SettingRow>

        <SettingsDivider />

        <SettingRow
          label="Compact Mode"
          description="Reduce spacing for a denser view"
        >
          <Switch checked={compactMode} onCheckedChange={setCompactMode} />
        </SettingRow>
      </SectionCard>

      {/* ── Dashboard ── */}
      <SectionCard title="Dashboard">
        <SettingRow
          label="Remove Blob Animation"
          description="Hide the cursor-following blob effect on the dashboard"
        >
          <Switch checked={removeBlob} onCheckedChange={setRemoveBlob} />
        </SettingRow>
      </SectionCard>
    </div>
  );
}
