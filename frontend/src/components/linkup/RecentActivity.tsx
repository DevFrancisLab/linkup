import { Check, Handshake, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  text: string;
  time: string;
  status: string;
  tone: "success" | "secondary" | "accent";
}

const toneClasses: Record<ActivityItem["tone"], string> = {
  success: "bg-success/12 text-success",
  secondary: "bg-secondary/12 text-secondary",
  accent: "bg-accent/15 text-accent",
};

const toneTextClasses: Record<ActivityItem["tone"], string> = {
  success: "text-success",
  secondary: "text-secondary",
  accent: "text-accent",
};

const ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    icon: Check,
    text: "Brian accepted your connection request",
    time: "12m ago",
    status: "Connected",
    tone: "success",
  },
  {
    id: "2",
    icon: Handshake,
    text: "Sarah is looking for collaborators",
    time: "40m ago",
    status: "Open to connect",
    tone: "secondary",
  },
  {
    id: "3",
    icon: Users,
    text: "Three AI founders nearby",
    time: "1h ago",
    status: "Nearby now",
    tone: "accent",
  },
];

interface RecentActivityProps {
  items?: ActivityItem[];
  isLoading?: boolean;
}

export function RecentActivity({
  items = ACTIVITY,
  isLoading = false,
}: RecentActivityProps) {
  return (
    <section className="surface-card rounded-3xl border border-border/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Recent Activity
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>
      {isLoading ? (
        <div
          className="mt-5 space-y-4"
          aria-label="Loading recent activity"
          role="status"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex gap-3.5 animate-pulse">
              <span className="size-10 shrink-0 rounded-2xl bg-muted" />
              <span className="flex-1 space-y-2 pt-1">
                <span className="block h-4 w-4/5 rounded bg-muted" />
                <span className="block h-3 w-2/5 rounded bg-muted" />
              </span>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            Nothing new just yet
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Activity from your event will appear here.
          </p>
        </div>
      ) : (
        <ol className="mt-5 space-y-0.5">
          {items.map((item, index) => (
            <li key={item.id} className="flex gap-3.5">
              <div className="flex w-10 shrink-0 flex-col items-center">
                <span
                  className={`flex size-10 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}
                >
                  <item.icon className="size-[18px]" strokeWidth={2.25} />
                </span>
                {index < items.length - 1 && (
                  <span className="my-1.5 w-px flex-1 bg-border/80" />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-5 pt-0.5 last:pb-0">
                <p className="text-sm font-semibold leading-5 text-foreground">
                  {item.text}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.time}</span>
                  <span className="size-1 rounded-full bg-border" />
                  <span className={`font-medium ${toneTextClasses[item.tone]}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
