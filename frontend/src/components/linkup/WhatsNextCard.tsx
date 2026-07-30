import { Car, Coffee, Handshake } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    id: "coffee",
    icon: Coffee,
    title: "Grab Coffee",
    description: "Meet attendees having coffee right now.",
    tint: "bg-amber-100 text-amber-700",
  },
  {
    id: "network",
    icon: Handshake,
    title: "Continue Networking",
    description: "Meet people with shared interests.",
    tint: "bg-primary/10 text-primary",
  },
  {
    id: "ride",
    icon: Car,
    title: "Share Ride",
    description: "Find attendees travelling in your direction.",
    tint: "bg-accent/15 text-accent-foreground",
  },
];

interface WhatsNextCardProps {
  onIntentSubmit?: (intention: string) => void;
}

export function WhatsNextCard({ onIntentSubmit }: WhatsNextCardProps) {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <section aria-labelledby="whats-next-title">
      <div className="mb-3.5 px-1">
        <h2
          id="whats-next-title"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          What&apos;s Next?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Make the most of the moment.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isSelected = selectedId === action.id;
          return (
            <button
              key={action.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedId(action.id);
                onIntentSubmit?.(action.title);
              }}
              className={cn(
                "relative flex min-h-38 flex-col items-start overflow-hidden rounded-[1.35rem] border p-4 text-left shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]",
                isSelected
                  ? "border-primary/40 bg-primary/[0.06]"
                  : "border-border/70 bg-card",
              )}
            >
              <span className="pointer-events-none absolute -right-5 -top-7 size-20 rounded-full bg-primary/6 blur-2xl" />
              <span
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-2xl",
                  action.tint,
                )}
              >
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="relative mt-4 font-display text-sm font-semibold leading-tight text-foreground">
                {action.title}
              </span>
              <span className="relative mt-1.5 text-xs leading-[1.35] text-muted-foreground">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
