"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  Zap,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Assistant", href: "/assistant", icon: Sparkles },
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
  const router = useRouter();

  const handleAsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX <= 16) {
      onToggle();
    }
  };

  return (
    <aside
      onClick={handleAsideClick}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      <div className="relative flex h-14 flex-shrink-0 items-center px-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isCollapsed) {
              onToggle();
            } else {
              router.push("/dashboard");
            }
          }}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted cursor-pointer"
        >
          <Zap className="h-5 w-5 text-foreground" />
        </button>

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

      <nav className="flex flex-1 flex-col gap-1 px-2.5 py-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
