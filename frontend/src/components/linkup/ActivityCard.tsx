import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityTone = "success" | "secondary" | "accent";

const toneClasses: Record<ActivityTone, string> = {
  success: "bg-success/12 text-success",
  secondary: "bg-secondary/12 text-secondary",
  accent: "bg-accent/15 text-accent",
};

const toneTextClasses: Record<ActivityTone, string> = {
  success: "text-success",
  secondary: "text-secondary",
  accent: "text-accent",
};

interface ActivityCardProps {
  icon: LucideIcon;
  text: string;
  time: string;
  status: string;
  tone: ActivityTone;
  showConnector?: boolean;
}

export function ActivityCard({
  icon: Icon,
  text,
  time,
  status,
  tone,
  showConnector = false,
}: ActivityCardProps) {
  return (
    <li className="flex gap-3.5">
      <div className="flex w-10 shrink-0 flex-col items-center">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-2xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-[18px]" strokeWidth={2.25} />
        </span>
        {showConnector && <span className="my-1.5 w-px flex-1 bg-border/80" />}
      </div>
      <div className="min-w-0 flex-1 pb-5 pt-0.5">
        <p className="text-sm font-semibold leading-5 text-foreground">
          {text}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{time}</span>
          <span className="size-1 rounded-full bg-border" />
          <span className={cn("font-medium", toneTextClasses[tone])}>
            {status}
          </span>
        </div>
      </div>
    </li>
  );
}
