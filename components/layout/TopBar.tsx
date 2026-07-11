"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Command, LogOut } from "lucide-react";
import { RightPanelToggle } from "@/components/layout/RightContextPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface TopBarProps {
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  showActivityPanel?: boolean;
}

interface Profile {
  name: string | null | undefined;
  company_name: string | null | undefined;
  avatar_url: string | null | undefined;
  email: string | null;
}

export function TopBar({ rightPanelOpen, onToggleRightPanel, showActivityPanel = true }: TopBarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [clickingSearch, setClickingSearch] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      // First, try getSession() - reads from localStorage instantly (no network)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;

        // Then fetch profile from database
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, company_name, avatar_url")
          .eq("id", user.id)
          .single();

        setProfile({
          name: profileData?.name ?? null,
          company_name: profileData?.company_name ?? null,
          avatar_url: profileData?.avatar_url ?? null,
          email: user.email ?? null,
        });
      } else {
        // Mock user fallback when no session
        setProfile({
          name: "Thanki",
          company_name: "sadsa",
          avatar_url: null,
          email: "2ndaccforsmart@gmail.com",
        });
      }
      setLoading(false);
    }

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, company_name, avatar_url")
          .eq("id", user.id)
          .single();

        setProfile({
          name: profileData?.name ?? null,
          company_name: profileData?.company_name ?? null,
          avatar_url: profileData?.avatar_url ?? null,
          email: user.email ?? null,
        });
      } else {
        // Mock user fallback when no session
        setProfile({
          name: "Thanki",
          company_name: "sadsa",
          avatar_url: null,
          email: "2ndaccforsmart@gmail.com",
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const userName = profile?.name || profile?.email?.split("@")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = profile?.email || "";

  const handleSearchNav = () => {
    setClickingSearch(true);
    setTimeout(() => {
      router.push("/search");
    }, 180);
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
        <div className="w-20" />
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <div className="flex h-9 w-full cursor-pointer items-center rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 text-sm text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1.5" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
      {/* Left: spacer for balance */}
      <div className="w-20" />

      {/* Center: Search */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 pointer-events-none z-10" />
          <button
            onClick={handleSearchNav}
            disabled={clickingSearch}
            className={cn(
              "flex h-9 w-full items-center rounded-xl border pl-10 pr-4 text-sm text-muted-foreground transition-all duration-150",
              clickingSearch
                ? "scale-95 border-primary/40 bg-primary/5 shadow-lg"
                : "border-border/60 bg-muted/30 hover:border-border hover:bg-muted/50 hover:shadow-sm"
            )}
          >
            <span className="flex-1 text-left">Search companies, industries...</span>
            <kbd className="flex h-5 items-center gap-0.5 rounded-md border border-border/60 bg-background px-1.5 font-mono text-[10px] text-muted-foreground/60">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {showActivityPanel && (
          <RightPanelToggle
            isOpen={rightPanelOpen}
            onToggle={onToggleRightPanel}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-muted/60 transition-all duration-150 hover:bg-muted hover:ring-2 hover:ring-border">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={userName} />
                ) : (
                  <AvatarFallback className={cn(
                    "bg-transparent text-xs font-medium text-muted-foreground",
                    profile?.avatar_url ? "" : "bg-muted"
                  )}>
                    {userInitial}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                    {userInitial}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive flex items-center gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}