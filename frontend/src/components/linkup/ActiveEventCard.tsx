import { CalendarDays, Check, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface ActiveEventCardProps {
  title: string;
  location: string;
  day: string;
  attendees: number;
  onEnter?: () => void;
}

export function ActiveEventCard({
  title,
  location,
  day,
  attendees,
  onEnter,
}: ActiveEventCardProps) {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    onEnter?.();
  };

  return (
    <section className="gradient-brand relative overflow-hidden rounded-[1.75rem] p-6 shadow-[var(--shadow-raised)]">
      <div className="pointer-events-none absolute -right-10 -top-14 size-48 rounded-full bg-accent/35 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 size-40 rounded-full bg-primary-foreground/10 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-primary-foreground/10" />
      <div className="relative">
        <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/15 px-3.5 text-xs font-semibold tracking-wide text-primary-foreground backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/80" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Your event is live
        </span>
        <h2 className="mt-4 max-w-[18rem] font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-primary-foreground">
          {title}
        </h2>
        <dl className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-primary-foreground/85">
          <div className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-primary-foreground/10 px-2.5">
            <dt className="sr-only">Location</dt>
            <MapPin className="size-4" />
            <dd>{location}</dd>
          </div>
          <div className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-primary-foreground/10 px-2.5">
            <dt className="sr-only">Date</dt>
            <CalendarDays className="size-4" />
            <dd>{day}</dd>
          </div>
          <div className="flex w-full items-center gap-2 pt-1 text-primary-foreground">
            <dt className="sr-only">Attendees</dt>
            <span className="flex size-8 items-center justify-center rounded-full bg-success/20 text-success ring-1 ring-success/25">
              <Users className="size-4" />
            </span>
            <dd className="text-sm font-semibold">
              {attendees} people ready to connect
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={handleEnter}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-card font-display text-base font-semibold text-primary shadow-[0_8px_18px_oklch(0.21_0.035_258_/_0.22)] transition-[transform,box-shadow] motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_12px_22px_oklch(0.21_0.035_258_/_0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0 active:scale-[0.98]"
        >
          {hasEntered ? (
            <>
              <Check className="size-5" aria-hidden="true" />
              You&apos;re in
            </>
          ) : (
            "Enter Event"
          )}
        </button>
      </div>
    </section>
  );
}
