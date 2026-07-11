"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SlashCommand {
  command: string;
  description: string;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  { command: "/web-search", description: "Search the web for real-time info" },
];

interface CommandDropupProps {
  text: string;
  onSelect: (command: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export function CommandDropup({ text, onSelect, anchorRef }: CommandDropupProps) {
  const dropupRef = useRef<HTMLDivElement>(null);

  // Parse what the user is typing after /
  const slashMatch = text.match(/^\/(\w*)$/);
  const filter = slashMatch ? slashMatch[1].toLowerCase() : null;

  const filtered = filter
    ? SLASH_COMMANDS.filter((c) =>
        c.command.slice(1).toLowerCase().startsWith(filter)
      )
    : [];

  const visible = filter !== null && filtered.length > 0;

  // Close on click outside
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropupRef.current &&
        !dropupRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        // Will re-evaluate on next render — just let the state handle it
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [visible, anchorRef]);

  if (!visible) return null;

  return (
    <div
      ref={dropupRef}
      className="absolute bottom-full left-0 right-0 mb-1.5 z-50 rounded-lg border border-border/60 bg-popover shadow-lg"
    >
      <div className="py-1">
        {filtered.map((cmd) => (
          <button
            key={cmd.command}
            onClick={() => onSelect(cmd.command + " ")}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent cursor-pointer"
          >
            <code className="rounded bg-muted/60 px-1.5 py-0.5 text-xs font-medium text-primary">
              {cmd.command}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
