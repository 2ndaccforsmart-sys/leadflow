"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  Zap,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Search", href: "/search", icon: Search },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {isCollapsed && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="absolute right-0 top-0 z-50 h-full w-4 cursor-ew-resize transition-all hover:w-5 hover:bg-border/30"
          title="Expand sidebar"
        />
      )}

      <div className="relative flex h-14 flex-shrink-0 items-center px-3">
        <Link
          href="/dashboard"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted"
        >
          <Zap className="h-5 w-5 text-foreground" />
        </Link>

        {!isCollapsed && (
          <>
            <span className="ml-2 flex-1 whitespace-nowrap text-sm font-semibold tracking-tight">
              LeadFlow
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
