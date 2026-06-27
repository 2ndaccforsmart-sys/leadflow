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
  PanelLeftOpen,
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
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo + Toggle */}
      <div className="flex h-14 items-center gap-2 px-3">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted"
        >
          <Zap className="h-5 w-5 text-foreground" />
        </Link>

        <div
          className={cn(
            "flex flex-1 items-center overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight">
            LeadFlow
          </span>
        </div>

        <button
          onClick={onToggle}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <TooltipProvider delay={0}>
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
                    <span
                      className={cn(
                        "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                      )}
                    >
                      {item.name}
                    </span>
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
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/50 hover:text-foreground">
                <Search className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    "flex flex-1 items-center overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}
                >
                  <span className="flex-1 text-left">Search</span>
                  <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
                    <Command className="mr-0.5 h-2.5 w-2.5" />K
                  </kbd>
                </span>
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                Search ⌘K
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
