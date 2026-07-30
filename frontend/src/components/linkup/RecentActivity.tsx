import { Check, Search, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  text: string;
  time: string;
  tone: "success" | "secondary" | "accent";
}

const toneClasses: Record<ActivityItem["tone"], string> = {
  success: "bg-success/12 text-success",
  secondary: "bg-secondary/12 text-secondary",
  accent: "bg-accent/15 text-accent",
};

const ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    icon: Check,
    text: "Brian accepted your request",
    time: "12m ago",
    tone: "success",
  },
  {
    id: "2",
    icon: Search,
    text: "Sarah is looking for collaborators",
    time: "40m ago",
    tone: "secondary",
  },
  {
    id: "3",
    icon: Users,
    text: "Three AI founders nearby",
    time: "1h ago",
    tone: "accent",
  },
];

export function RecentActivity() {
  return (
    <section className="surface-card rounded-3xl border border-border/60 p-5">
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
        Recent Activity
      </h2>
      <ol className="mt-4 space-y-1">
        {ACTIVITY.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-9 items-center justify-center rounded-full ${toneClasses[item.tone]}`}
              >
                <item.icon className="size-4" />
              </span>
              {index < ACTIVITY.length - 1 && (
                <span className="my-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="pb-4 pt-1.5">
              <p className="text-sm font-medium leading-tight text-foreground">
                {item.text}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
