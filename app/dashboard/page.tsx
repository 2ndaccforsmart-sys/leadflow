"use client";

import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { getGreeting, getTimeIcon } from "@/lib/greetings";

export default function DashboardPage() {
  const userName = "Daksh";

  const { greeting, action } = useMemo(
    () => getGreeting(userName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const timeIcon = getTimeIcon();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {greeting} {timeIcon}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{action}</p>
        </div>

        {/* Content area - empty shell */}
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-medium text-foreground">
              Dashboard content
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Your dashboard will display lead generation metrics and recent
              activity once data is available.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
