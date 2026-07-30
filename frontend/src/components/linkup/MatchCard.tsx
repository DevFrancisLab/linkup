import { Sparkles, UserPlus } from "lucide-react";
import { AvatarPlaceholder } from "./Avatar";

export interface Match {
  id: string;
  name: string;
  profession: string;
  matchPercent: number;
  interests: string[];
  reason: string;
}

interface MatchCardProps {
  match: Match;
  onConnect?: (id: string) => void;
}

export function MatchCard({ match, onConnect }: MatchCardProps) {
  return (
    <article className="surface-card rounded-3xl border border-border/60 p-4">
      <div className="flex items-center gap-3">
        <AvatarPlaceholder name={match.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
            {match.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{match.profession}</p>
        </div>
        <span className="rounded-full bg-success/12 px-3 py-1.5 text-sm font-semibold text-success">
          {match.matchPercent}%
        </span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {match.interests.map((interest) => (
          <li
            key={interest}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {interest}
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-accent/10 p-3 text-sm leading-snug text-foreground/80">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
        {match.reason}
      </p>

      <button
        type="button"
        onClick={() => onConnect?.(match.id)}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-display text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <UserPlus className="size-4" />
        Connect
      </button>
    </article>
  );
}
