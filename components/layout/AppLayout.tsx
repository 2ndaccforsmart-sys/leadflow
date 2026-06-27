"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useSidebar } from "./SidebarProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      <div
        style={{
          paddingLeft: isCollapsed ? "60px" : "220px",
          transition: "padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
