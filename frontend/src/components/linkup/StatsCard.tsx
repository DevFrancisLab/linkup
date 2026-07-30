import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <article
      className={cn(
        "surface-card rounded-2xl border border-border/60 p-4",
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </article>
  );
}
