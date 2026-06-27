"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  Zap,
  Plus,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const workspaces = [
  { name: "Personal", emoji: "P" },
  { name: "Work", emoji: "W" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeWorkspace, setActiveWorkspace] = useState(0);

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-[60px] flex-col items-center border-r border-white/[0.06] bg-[#0a0a0a] py-3">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] transition-all duration-200 hover:bg-white/[0.12] hover:scale-105"
        >
          <Zap className="h-5 w-5 text-white" />
        </Link>

        {/* Search Shortcut */}
        <Tooltip>
          <TooltipTrigger>
            <button className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-[#666] transition-all duration-200 hover:bg-white/[0.06] hover:text-[#999]">
              <Search className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <div className="flex items-center gap-2">
              <span>Search</span>
              <kbd className="flex h-5 items-center rounded-md border border-white/10 bg-white/[0.06] px-1.5 font-mono text-[10px] text-[#888]">
                <Command className="mr-0.5 h-2.5 w-2.5" />K
              </kbd>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-white/[0.1] text-white"
                        : "text-[#666] hover:bg-white/[0.06] hover:text-[#999]"
                    )}
                  >
                    {isActive && (
                      <div className="absolute -left-[13px] h-5 w-[3px] rounded-r-full bg-white" />
                    )}
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Workspace Switcher */}
        <div className="mb-3 flex flex-col items-center gap-1">
          {workspaces.map((workspace, index) => (
            <Tooltip key={workspace.name}>
              <TooltipTrigger>
                <button
                  onClick={() => setActiveWorkspace(index)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-medium transition-all duration-200",
                    activeWorkspace === index
                      ? "bg-white/[0.1] text-white"
                      : "bg-white/[0.04] text-[#666] hover:bg-white/[0.08] hover:text-[#999]"
                  )}
                >
                  {workspace.emoji}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                {workspace.name}
              </TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-white/[0.08] text-[#555] transition-all duration-200 hover:border-white/[0.15] hover:text-[#888]">
                <Plus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              New Workspace
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Divider */}
        <div className="mb-3 h-px w-8 bg-white/[0.06]" />

        {/* User Profile */}
        <Tooltip>
          <TooltipTrigger>
            <button className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/[0.06]">
              <Avatar className="h-8 w-8 border-2 border-white/[0.08] transition-all duration-200 group-hover:border-white/[0.15]">
                <AvatarFallback className="bg-white/[0.08] text-[11px] font-medium text-[#999]">
                  D
                </AvatarFallback>
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Daksh</span>
              <span className="text-[#888]">Free Plan</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}
