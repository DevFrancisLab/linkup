import type { ReactNode } from "react";
import { AvatarPlaceholder } from "./Avatar";

interface PersonCardProps {
  name: string;
  subtitle: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PersonCard({
  name,
  subtitle,
  action,
  children,
}: PersonCardProps) {
  return (
    <article className="surface-card rounded-3xl border border-border/60 p-5">
      <div className="flex items-center gap-4">
        <AvatarPlaceholder name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold tracking-tight text-foreground">
            {name}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </article>
  );
}
