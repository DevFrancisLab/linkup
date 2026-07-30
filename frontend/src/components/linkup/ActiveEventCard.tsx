import { CalendarDays, MapPin, Users } from "lucide-react";

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
  return (
    <section className="gradient-brand relative overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-raised)]">
      <div className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full bg-accent/30 blur-2xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Live now
        </span>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-primary-foreground">
          {title}
        </h2>
        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-foreground/85">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            <dd>{location}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            <dd>{day}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-4" />
            <dd>{attendees} attendees</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onEnter}
          className="mt-5 h-13 w-full rounded-2xl bg-card font-display text-base font-semibold text-primary shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
        >
          Enter Event
        </button>
      </div>
    </section>
  );
}
