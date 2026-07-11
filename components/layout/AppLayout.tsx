"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { RightContextPanel } from "./RightContextPanel";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggle } = useSidebar();
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(true);

  useEffect(() => {
    const checkSetting = () => {
      try {
        const stored = localStorage.getItem("settings_activity_panel");
        if (stored !== null) {
          setShowActivityPanel(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    };

    checkSetting();
    const id = setInterval(checkSetting, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "pl-[68px]" : "pl-64",
          showActivityPanel && rightPanelOpen ? "pr-80" : "pr-0"
        )}
      >
        <TopBar
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          showActivityPanel={showActivityPanel}
        />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
      {showActivityPanel && (
        <RightContextPanel isOpen={rightPanelOpen} />
      )}
    </div>
  );
}
