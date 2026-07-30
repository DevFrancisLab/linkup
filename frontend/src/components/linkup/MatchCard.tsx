import { Check, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { AvatarPlaceholder } from "./Avatar";
import { PrimaryButton } from "./Button";

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
    <article className="surface-card relative overflow-hidden rounded-3xl border border-border/70 p-5 shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[var(--shadow-raised)]">
      <div className="pointer-events-none absolute -right-12 -top-16 size-32 rounded-full bg-primary/7 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-card/75 via-transparent to-primary/[0.025]" />
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 p-1 ring-1 ring-primary/15 shadow-[0_5px_12px_oklch(0.546_0.215_262.9_/_0.12)]">
            <AvatarPlaceholder
              name={match.name}
              size="xl"
              className="shadow-[0_6px_14px_oklch(0.546_0.215_262.9_/_0.24)] ring-2 ring-card"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Curated for your network
            </p>
            <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
              {match.name}
            </h3>
            <p className="mt-1 truncate text-[13px] font-medium text-muted-foreground">
              {match.profession}
            </p>
          </div>
          <span
            aria-label={`${match.matchPercent}% professional alignment`}
            className="inline-flex min-h-12 flex-col items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/14 to-accent/8 px-3.5 text-primary shadow-[inset_0_1px_0_oklch(1_0_0_/_0.55)]"
          >
            <strong className="font-display text-[17px] font-semibold leading-none">
              {match.matchPercent}%
            </strong>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary/75">
              aligned
            </span>
          </span>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-border via-border/80 to-transparent" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Shared professional interests
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {match.interests.map((interest) => (
            <li
              key={interest}
              className="inline-flex min-h-8 items-center rounded-full border border-primary/10 bg-gradient-to-b from-primary/[0.09] to-primary/[0.04] px-3 text-[11px] font-bold text-primary/85"
            >
              {interest}
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/14 to-primary/[0.06] p-4">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            <span className="flex size-6 items-center justify-center rounded-full bg-card/45 shadow-sm">
              <Sparkles className="size-3.5" />
            </span>
            AI networking insight
          </p>
          <p className="mt-2.5 text-[13px] leading-5 text-foreground/85">
            {match.reason}
          </p>
        </div>

        <PrimaryButton
          type="button"
          onClick={handleConnect}
          aria-label={
            hasConnected
              ? `Connection request sent to ${match.name}`
              : `Connect with ${match.name}`
          }
          disabled={hasConnected}
          className="mt-5 h-12 min-h-12 w-full rounded-xl text-sm shadow-[0_5px_12px_oklch(0.546_0.215_262.9_/_0.2)] enabled:hover:shadow-[0_8px_16px_oklch(0.546_0.215_262.9_/_0.26)] disabled:cursor-default disabled:bg-success disabled:shadow-none"
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
        </PrimaryButton>
      </div>
    </article>
  );
}
