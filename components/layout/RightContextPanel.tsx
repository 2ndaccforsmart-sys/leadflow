"use client";

import { Bell, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RightContextPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function RightContextPanel({
  isOpen,
  onToggle,
}: RightContextPanelProps) {
  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-40 h-screen border-l border-border bg-card transition-all duration-300 ease-in-out",
        isOpen ? "w-80" : "w-0"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden",
          isOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-4">
          <h2 className="text-sm font-semibold text-foreground">Activity</h2>
        </div>

        <Separator />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Notification example */}
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    Welcome to LeadFlow
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start by searching for leads or exploring the dashboard.
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    Just now
                  </p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                No new activity
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your recent actions will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface RightPanelToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function RightPanelToggle({ isOpen, onToggle }: RightPanelToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "h-8 w-8 text-muted-foreground transition-colors",
        isOpen && "bg-accent text-accent-foreground"
      )}
    >
      {isOpen ? (
        <PanelRightClose className="h-4 w-4" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
    </Button>
  );
}
