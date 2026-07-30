import { CalendarDays, Check, Clock3, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { PrimaryButton } from "./Button";

export interface EventCardProps {
  title: string;
  location: string;
  day: string;
  attendees: number;
  time?: string;
  coverImage?: string;
  onEnter?: () => void;
}

export function EventCard({
  title,
  location,
  day,
  attendees,
  time = "10:00 AM",
  coverImage = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
  onEnter,
}: EventCardProps) {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    onEnter?.();
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-foreground shadow-[var(--shadow-raised)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_4px_8px_oklch(0.21_0.035_258_/_0.1),0_24px_48px_-20px_oklch(0.546_0.215_262.9_/_0.48)]">
      <img
        src={coverImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/82 to-foreground/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-card/15" />
      <div className="relative flex min-h-[390px] flex-col p-5 text-primary-foreground">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-card/15 bg-success/90 px-3.5 text-xs font-bold tracking-wide text-success-foreground shadow-sm backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success-foreground/80" />
              <span className="relative inline-flex size-2 rounded-full bg-success-foreground" />
            </span>
            Event live now
          </span>
          <span className="rounded-full bg-card/90 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-primary shadow-sm backdrop-blur-md">
            LinkUp
          </span>
        </div>
        <div className="mt-auto">
          <h2 className="max-w-[18rem] font-display text-[1.8rem] font-semibold leading-[1.08] tracking-tight text-primary-foreground">
            {title}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-primary-foreground/90">
            <div className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-card/12 px-2.5 backdrop-blur-md">
              <dt className="sr-only">Date</dt>
              <CalendarDays className="size-4 text-accent" />
              <dd>{day}</dd>
            </div>
            <div className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-card/12 px-2.5 backdrop-blur-md">
              <dt className="sr-only">Time</dt>
              <Clock3 className="size-4 text-accent" />
              <dd>{time}</dd>
            </div>
            <div className="col-span-2 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-card/12 px-2.5 backdrop-blur-md">
              <dt className="sr-only">Location</dt>
              <MapPin className="size-4 text-accent" />
              <dd className="truncate">{location}</dd>
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-1 text-primary-foreground">
              <dt className="sr-only">Attendees</dt>
              <span className="flex size-8 items-center justify-center rounded-full bg-success/20 text-success ring-1 ring-success/25">
                <Users className="size-4" />
              </span>
              <dd className="text-sm font-semibold">
                {attendees} people ready to connect
              </dd>
            </div>
          </dl>
        </div>
        <PrimaryButton
          type="button"
          onClick={handleEnter}
          className="mt-5 h-14 w-full rounded-2xl bg-card text-base text-primary shadow-[0_8px_18px_oklch(0.21_0.035_258_/_0.28)] hover:shadow-[0_12px_22px_oklch(0.21_0.035_258_/_0.32)] focus-visible:ring-primary-foreground focus-visible:ring-offset-foreground"
        >
          {hasEntered ? (
            <>
              <Check className="size-5" aria-hidden="true" />
              You&apos;re in
            </>
          ) : (
            "Enter Event"
          )}
        </PrimaryButton>
      </div>
    </section>
  );
}
