import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { MotionProvider } from "@/components/motion";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadFlow - AI-Powered Lead Generation",
  description: "Find leads. Understand them. Contact them. Close more deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <MotionProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </MotionProvider>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 6000,
          }}
        />
      </body>
    </html>
  );
}
