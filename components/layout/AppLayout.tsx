"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 60 : 220;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        style={{
          paddingLeft: `${sidebarWidth}px`,
          transition: "padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
