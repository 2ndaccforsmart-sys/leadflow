"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const NUDGE_MESSAGES = [
  "Ready for some leads?",
  "New leads might be waiting for you!",
  "Time to find your next client.",
  "A fresh search could uncover new opportunities.",
  "Your next big deal could be just a search away.",
  "Got a minute? Let's find some leads.",
];

const TIMER_MAP: Record<string, number> = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "60m": 60 * 60 * 1000,
  "3h": 3 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
};

function getRandomMessage(): string {
  return NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];
}

export function AINudgeProvider({ userName }: { userName?: string }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const clearAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeRef.current = false;
  }, []);

  const startNudges = useCallback(
    (ms: number) => {
      if (activeRef.current) return;

      const fire = () => {
        const greeting = userName ? `Hey ${userName}, ` : "";
        toast(greeting + getRandomMessage(), {
          icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
        });
      };

      // First nudge after a random offset
      const initialDelay = Math.random() * ms * 0.3;
      timeoutRef.current = setTimeout(() => {
        fire();
        activeRef.current = true;
        intervalRef.current = setInterval(fire, ms);
      }, initialDelay);
    },
    [userName]
  );

  useEffect(() => {
    const getSetting = (): string => {
      try {
        const stored = localStorage.getItem("settings_ai_nudges");
        return stored ? JSON.parse(stored) : "Off";
      } catch {
        return "Off";
      }
    };

    const schedule = () => {
      clearAll();
      const value = getSetting();
      if (value === "Off") return;
      const ms = TIMER_MAP[value];
      if (!ms) return;
      startNudges(ms);
    };

    // Listen for visibility changes — pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        clearAll();
      } else {
        schedule();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    schedule();

    // Poll for setting changes
    const pollId = setInterval(schedule, 2000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(pollId);
      clearAll();
    };
  }, [clearAll, startNudges]);

  return null;
}
