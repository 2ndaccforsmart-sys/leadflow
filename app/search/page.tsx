import { AppLayout } from "@/components/layout/AppLayout";

export default function SearchPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find potential leads by keyword, location, or industry.
          </p>
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-medium text-foreground">
              Search for leads
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Use the search bar above to find potential leads by company name,
              industry, or location.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
