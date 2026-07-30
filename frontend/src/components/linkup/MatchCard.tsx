import { Check, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
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
  const [hasConnected, setHasConnected] = useState(false);

  const handleConnect = () => {
    setHasConnected(true);
    onConnect?.(match.id);
  };

  return (
    <article className="surface-card rounded-3xl border border-border/60 p-6 transition-shadow motion-reduce:transition-none hover:shadow-[var(--shadow-raised)]">
      <div className="flex items-center gap-4">
        <AvatarPlaceholder
          name={match.name}
          size="xl"
          className="shadow-[0_6px_14px_oklch(0.546_0.215_262.9_/_0.24)] ring-2 ring-card"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
            {match.name}
          </h3>
          <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
            {match.profession}
          </p>
        </div>
        <span
          aria-label={`${match.matchPercent}% compatibility`}
          className="inline-flex min-h-10 flex-col items-center justify-center rounded-2xl border border-success/20 bg-success/12 px-3 text-success"
        >
          <strong className="font-display text-base font-semibold leading-none">
            {match.matchPercent}%
          </strong>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">
            match
          </span>
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {match.interests.map((interest) => (
          <li
            key={interest}
            className="inline-flex min-h-8 items-center rounded-full border border-primary/10 bg-primary/5 px-3 text-xs font-semibold text-foreground/75"
          >
            {interest}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/10 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
          <span className="flex size-6 items-center justify-center rounded-full bg-accent/15">
            <Sparkles className="size-3.5" />
          </span>
          AI match insight
        </p>
        <p className="mt-2.5 text-sm leading-5 text-foreground/85">
          {match.reason}
        </p>
      </div>

      <button
        type="button"
        onClick={handleConnect}
        aria-label={
          hasConnected
            ? `Connection request sent to ${match.name}`
            : `Connect with ${match.name}`
        }
        disabled={hasConnected}
        className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_14px_oklch(0.546_0.215_262.9_/_0.24)] transition-[transform,box-shadow] motion-reduce:transition-none enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_9px_18px_oklch(0.546_0.215_262.9_/_0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 enabled:active:translate-y-0 enabled:active:scale-[0.98] disabled:cursor-default disabled:bg-success disabled:shadow-none"
      >
        {hasConnected ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Request sent
          </>
        ) : (
          <>
            <UserPlus className="size-4" aria-hidden="true" />
            Connect
          </>
        )}
      </button>
    </article>
  );
}
