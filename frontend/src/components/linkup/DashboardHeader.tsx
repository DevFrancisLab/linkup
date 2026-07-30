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
    <header className="flex items-center gap-3 px-5 pb-5 pt-6">
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
        className="relative flex size-12 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition-[transform,box-shadow] motion-reduce:transition-none hover:shadow-[var(--shadow-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
      >
        <Bell className="size-5" strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground ring-2 ring-card">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
}
