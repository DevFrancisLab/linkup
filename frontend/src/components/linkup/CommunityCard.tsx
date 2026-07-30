import type { ReactNode } from "react";
import { AvatarGroup } from "./AvatarGroup";

interface CommunityCardProps {
  title: string;
  description: string;
  members: string[];
  action?: ReactNode;
}

export function CommunityCard({
  title,
  description,
  members,
  action,
}: CommunityCardProps) {
  return (
    <article className="surface-card rounded-3xl border border-border/60 p-5">
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <AvatarGroup names={members} label={`${title} members`} />
        {action}
      </div>
    </article>
  );
}
