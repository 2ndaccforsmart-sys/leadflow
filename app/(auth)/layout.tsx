export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">LeadFlow</h1>
          <p className="text-muted-foreground">
            AI-powered lead generation platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
