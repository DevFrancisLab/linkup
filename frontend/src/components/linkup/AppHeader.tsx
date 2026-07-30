import { Bell } from "lucide-react";
import { AvatarPlaceholder } from "./Avatar";

export interface AppHeaderProps {
  name: string;
  avatarUrl?: string | null;
  greeting: string;
  notificationCount?: number;
  onNotificationsClick?: () => void;
}

export function AppHeader({
  name,
  avatarUrl,
  greeting,
  notificationCount = 0,
  onNotificationsClick,
}: AppHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-5 pb-5 pt-6">
      <AvatarPlaceholder
        name={name}
        imageUrl={avatarUrl}
        size="lg"
        ring
        className="shadow-[0_5px_14px_oklch(0.546_0.215_262.9_/_0.18)]"
      />
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
        onClick={onNotificationsClick}
        aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
        className="relative flex size-12 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-95"
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
