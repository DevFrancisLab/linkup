import {
  BriefcaseBusiness,
  Car,
  Coffee,
  Handshake,
  PartyPopper,
  Sparkles,
} from "lucide-react";
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
  {
    id: "after-party",
    icon: PartyPopper,
    title: "After Party",
    description: "Discover people heading to post-event gatherings.",
    tint: "bg-secondary/10 text-secondary",
  },
  {
    id: "opportunities",
    icon: BriefcaseBusiness,
    title: "Find Opportunities",
    description: "Meet recruiters, founders and collaborators.",
    tint: "bg-success/15 text-success",
  },
];

interface WhatsNextCardProps {
  onIntentSubmit?: (intention: string) => void;
}

export function WhatsNextCard({ onIntentSubmit }: WhatsNextCardProps) {
  const [selectedId, setSelectedId] = useState<string>();

  const submitIntent = (intention: string) => {
    if (onIntentSubmit) {
      onIntentSubmit(intention);
      return;
    }
    window.dispatchEvent(
      new CustomEvent("linkup:assistant-prompt", { detail: { intention } }),
    );
  };

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
                submitIntent(action.title);
              }}
              aria-label={`${action.title}. ${action.description}`}
              className={cn(
                "group relative flex min-h-43 flex-col items-start overflow-hidden rounded-[1.5rem] border p-4 text-left shadow-[0_1px_2px_oklch(0.21_0.035_258_/_0.05),0_12px_24px_-16px_oklch(0.21_0.035_258_/_0.28)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_4px_10px_oklch(0.21_0.035_258_/_0.07),0_20px_32px_-16px_oklch(0.546_0.215_262.9_/_0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]",
                isSelected
                  ? "border-primary/40 bg-primary/[0.07]"
                  : "border-border/70 bg-gradient-to-br from-card to-primary/[0.025]",
              )}
            >
              <span className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-200 group-active:opacity-100" />
              <span className="pointer-events-none absolute -right-5 -top-7 size-24 rounded-full bg-primary/7 blur-2xl" />
              <span
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45),0_5px_12px_oklch(0.21_0.035_258_/_0.08)]",
                  action.tint,
                )}
              >
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="relative mt-4 font-display text-[15px] font-semibold leading-tight tracking-tight text-foreground">
                {action.title}
              </span>
              <span className="relative mt-1.5 text-xs font-medium leading-[1.4] text-muted-foreground">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
      <aside className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-primary/15 bg-gradient-to-br from-primary/[0.1] via-card to-secondary/[0.1] p-4 shadow-[var(--shadow-soft)]">
        <span className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl gradient-brand text-primary-foreground shadow-[0_5px_12px_oklch(0.546_0.215_262.9_/_0.28)]">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold tracking-tight text-foreground">
              AI Recommendation
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
              Based on your interests, 5 AI founders nearby are currently
              looking for collaborators.
            </p>
            <button
              type="button"
              onClick={() => submitIntent("Find AI matches")}
              className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-[0_4px_10px_oklch(0.546_0.215_262.9_/_0.22)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_7px_14px_oklch(0.546_0.215_262.9_/_0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
            >
              View Matches
            </button>
          </div>
        </div>
      </aside>
    </section>
  );
}
