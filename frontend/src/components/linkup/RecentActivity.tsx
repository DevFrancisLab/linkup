import { Check, Handshake, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ActivityCard, type ActivityTone } from "./ActivityCard";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  text: string;
  time: string;
  status: string;
  tone: ActivityTone;
}

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
    <section className="surface-card rounded-3xl border border-border/70 p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Recent Activity
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_0_3px_oklch(0.696_0.17_162.5_/_0.12)]" />
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
            <div key={index} className="flex gap-3.5">
              <LoadingSkeleton className="size-10 shrink-0 rounded-2xl" />
              <span className="flex-1 space-y-2 pt-1">
                <LoadingSkeleton className="h-4 w-4/5" />
                <LoadingSkeleton className="h-3 w-2/5" />
              </span>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="Nothing new just yet"
            description="Activity from your event will appear here."
          />
        </div>
      ) : (
        <ol className="mt-5 space-y-0.5">
          {items.map((item, index) => (
            <ActivityCard
              key={item.id}
              {...item}
              showConnector={index < items.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
