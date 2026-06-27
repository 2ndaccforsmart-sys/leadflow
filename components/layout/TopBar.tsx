"use client";

import { Search, Command } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-white/[0.06] bg-[#0a0a0a]/80 px-6 backdrop-blur-xl">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
          <div className="flex h-9 cursor-text items-center rounded-lg bg-white/[0.04] pl-9 pr-3 text-sm text-[#555] transition-colors hover:bg-white/[0.06]">
            <span className="flex-1">Search...</span>
            <kbd className="flex h-5 items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 font-mono text-[10px] text-[#666]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>
      </div>
    </header>
  );
}
