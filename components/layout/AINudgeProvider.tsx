"use client";

import { useEffect, useRef } from "react";
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastToastRef = useRef(0);

  useEffect(() => {
    const checkAndSchedule = () => {
      // Clear existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      try {
        const stored = localStorage.getItem("settings_ai_nudges");
        const value: string = stored ? JSON.parse(stored) : "Off";

        if (value === "Off") return;

        const ms = TIMER_MAP[value];
        if (!ms) return;

        // Start with a random offset so first nudge isn't immediate
        const initialDelay = Math.random() * ms * 0.3;
        const initialTimer = setTimeout(() => {
          const greeting = userName ? `Hey ${userName}, ` : "";
          toast(greeting + getRandomMessage(), {
            icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
          });

          // Then fire at the regular interval
          timerRef.current = setInterval(() => {
            const greeting2 = userName ? `Hey ${userName}, ` : "";
            toast(greeting2 + getRandomMessage(), {
              icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
            });
          }, ms);
        }, initialDelay);

        return () => {
          clearTimeout(initialTimer);
          if (timerRef.current) clearInterval(timerRef.current);
        };
      } catch {
        // ignore
      }
    };

    // Check on mount and re-check every 2s for setting changes
    checkAndSchedule();
    const pollId = setInterval(checkAndSchedule, 2000);
    return () => {
      clearInterval(pollId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userName]);

  return null;
}
