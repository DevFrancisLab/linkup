import { Bell } from "lucide-react";
import { AvatarPlaceholder } from "./Avatar";

interface DashboardHeaderProps {
  name: string;
  greeting: string;
  notificationCount?: number;
}

export function DashboardHeader({
  name,
  greeting,
  notificationCount = 0,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-5 pb-4 pt-6">
      <AvatarPlaceholder name={name} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          LinkUp
        </p>
        <h1 className="truncate font-display text-xl font-semibold tracking-tight text-foreground">
          {greeting}, {name} 👋
        </h1>
      </div>
      <button
        type="button"
        aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
        className="relative flex size-12 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
      >
        <Bell className="size-5" strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full bg-destructive ring-2 ring-card" />
        )}
      </button>
    </header>
  );
}
