import { useState, type FormEvent } from "react";
import {
  Car,
  Coffee,
  Handshake,
  PartyPopper,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INTENTS = [
  {
    id: "coffee",
    icon: Coffee,
    label: "Grab Coffee",
    description: "Find attendees grabbing coffee right now.",
  },
  {
    id: "lunch",
    icon: Utensils,
    label: "Get Lunch",
    description: "Join someone for a quick bite nearby.",
  },
  {
    id: "network",
    icon: Handshake,
    label: "Network",
    description: "Meet people open to a conversation.",
  },
  {
    id: "ride",
    icon: Car,
    label: "Share a Ride",
    description: "Connect with attendees heading your way.",
  },
  {
    id: "party",
    icon: PartyPopper,
    label: "After Party",
    description: "See who is planning the next stop.",
  },
];

interface WhatsNextCardProps {
  onIntentSubmit?: (intention: string) => void;
}

export function WhatsNextCard({ onIntentSubmit }: WhatsNextCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customIntent, setCustomIntent] = useState("");
  const [hasSubmittedIntent, setHasSubmittedIntent] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  const submitIntent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intention = customIntent.trim();
    if (intention) {
      setHasSubmittedIntent(true);
      onIntentSubmit?.(intention);
    }
  };

  return (
    <section className="surface-card rounded-3xl border border-border/60 p-5">
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
        What's Next?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        What would you like to do right now?
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {INTENTS.map((intent) => {
          const active = selected.includes(intent.id);
          const Icon = intent.icon;
          return (
            <button
              key={intent.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(intent.id)}
              className={cn(
                "flex min-h-35 flex-col items-start rounded-2xl border p-4 text-left transition-[transform,background-color,border-color,box-shadow] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
                intent.id === "party" && "col-span-2 min-h-31",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_6px_14px_oklch(0.546_0.215_262.9_/_0.22)]"
                  : "border-border/70 bg-card text-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-primary/25",
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl",
                  active
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="mt-3 font-display text-sm font-semibold leading-tight">
                {intent.label}
              </span>
              <span
                className={cn(
                  "mt-1 text-xs leading-[1.35]",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {intent.description}
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={submitIntent} className="mt-4">
        <label htmlFor="custom-intent" className="sr-only">
          Tell LinkUp what you would like to do
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/10 p-2 pl-3 transition-colors focus-within:border-primary/40 focus-within:bg-primary/5">
          <Sparkles
            className="size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <input
            id="custom-intent"
            value={customIntent}
            onChange={(event) => setCustomIntent(event.target.value)}
            placeholder="Tell AI what you want to do…"
            aria-describedby="custom-intent-help"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Share intention with AI"
            disabled={!customIntent.trim()}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_3px_8px_oklch(0.546_0.215_262.9_/_0.2)] transition-[transform,opacity] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p
          id="custom-intent-help"
          aria-live="polite"
          className="mt-2 px-1 text-xs text-muted-foreground"
        >
          {hasSubmittedIntent
            ? "Got it — LinkUp AI will use this to improve your recommendations."
            : "LinkUp AI uses your intention to suggest the right people and moments."}
        </p>
      </form>
    </section>
  );
}
