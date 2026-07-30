import { useState } from "react";
import { cn } from "@/lib/utils";

const INTENTS = [
  { id: "coffee", emoji: "☕", label: "Coffee" },
  { id: "lunch", emoji: "🍽", label: "Lunch" },
  { id: "network", emoji: "🤝", label: "Network" },
  { id: "ride", emoji: "🚗", label: "Share Ride" },
  { id: "party", emoji: "🎉", label: "After Party" },
];

export function WhatsNextCard() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  return (
    <section className="surface-card rounded-3xl border border-border/60 p-5">
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
        What's Next?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        What would you like to do right now?
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {INTENTS.map((intent) => {
          const active = selected.includes(intent.id);
          return (
            <button
              key={intent.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(intent.id)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all active:scale-95",
                active
                  ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "border-border bg-card text-foreground",
              )}
            >
              <span aria-hidden="true">{intent.emoji}</span>
              {intent.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
