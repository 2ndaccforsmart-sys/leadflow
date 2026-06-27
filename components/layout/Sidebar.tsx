"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  Zap,
  Command,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted"
          >
            <Zap className="h-5 w-5 text-foreground" />
          </Link>
          {!isCollapsed && (
            <span className="text-sm font-semibold tracking-tight">
              LeadFlow
            </span>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground",
              isCollapsed && "rotate-180"
            )}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                        isActive && "scale-110"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" sideOffset={8}>
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Search shortcut */}
        <div className="border-t border-border px-2 py-2">
          <Tooltip>
            <TooltipTrigger>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground">
                <Search className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">Search</span>
                    <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
                      <Command className="mr-0.5 h-2.5 w-2.5" />K
                    </kbd>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                Search ⌘K
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
