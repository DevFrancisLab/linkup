import { useState } from "react";
import { Calendar, Compass, Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "events", label: "Events", icon: Calendar },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "connections", label: "Connections", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="flex items-stretch justify-between px-2 py-2">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActive(tab.id)}
                className="flex w-full flex-col items-center gap-1 rounded-2xl py-1.5"
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-primary/12 text-primary" : "text-muted-foreground",
                  )}
                >
                  <tab.icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
