"use client";

import { Search, Command } from "lucide-react";
import { RightPanelToggle } from "@/components/layout/RightContextPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}

export function TopBar({ rightPanelOpen, onToggleRightPanel }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-tight">LeadFlow</span>
      </div>

      {/* Center: Search */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-10 cursor-text items-center rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/60 focus-within:border-ring focus-within:bg-muted/80 focus-within:ring-1 focus-within:ring-ring">
            <span className="flex-1">Search companies, industries...</span>
            <kbd className="flex h-5 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <RightPanelToggle
          isOpen={rightPanelOpen}
          onToggle={onToggleRightPanel}
        />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-transparent text-xs font-medium text-muted-foreground">
                  D
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                  D
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Daksh</span>
                <span className="text-xs text-muted-foreground">
                  daksh@example.com
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
