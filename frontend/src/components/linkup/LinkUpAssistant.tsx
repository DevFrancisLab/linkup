import { useNavigate } from "@tanstack/react-router";
import { ArrowUp, CalendarPlus, Search, Sparkles } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CommunityCard } from "./CommunityCard";
import { EventCard } from "./EventCard";
import { MatchCard, type Match } from "./MatchCard";
import { PersonCard } from "./PersonCard";

type AssistantAction =
  | "open-home"
  | "open-events"
  | "open-discover"
  | "open-connections"
  | "open-profile"
  | "open-event"
  | "create-event"
  | "edit-profile"
  | "filter-attendees"
  | "search-events"
  | "find-ai-matches";

type AssistantResult =
  | {
      kind: "event";
      message: string;
      action: AssistantAction;
      actionLabel: string;
    }
  | {
      kind: "match";
      message: string;
      action: AssistantAction;
      actionLabel: string;
    }
  | {
      kind: "person";
      message: string;
      action: AssistantAction;
      actionLabel: string;
    }
  | {
      kind: "community";
      message: string;
      action: AssistantAction;
      actionLabel: string;
    }
  | {
      kind: "action";
      message: string;
      action: AssistantAction;
      actionLabel: string;
    };

const SUGGESTIONS = [
  "Find AI founders",
  "Who's having coffee?",
  "Find people travelling to Westlands",
  "Continue networking",
  "Find tomorrow's events",
  "Create an event",
  "Show nearby attendees",
];

const AI_MATCH: Match = {
  id: "amina-noor",
  name: "Amina Noor",
  profession: "AI Product Lead · Nia Labs",
  matchPercent: 94,
  interests: ["Generative AI", "Fintech", "Community"],
  reason:
    "Amina is building practical AI products and is looking for founder conversations at the next LinkUp event.",
};

function resultFor(query: string): AssistantResult {
  const normalized = query.toLowerCase();

  if (normalized.includes("home")) {
    return {
      kind: "action",
      message: "Opening your LinkUp home feed.",
      action: "open-home",
      actionLabel: "Open Home",
    };
  }
  if (normalized.includes("connections")) {
    return {
      kind: "action",
      message: "Opening your network and connection requests.",
      action: "open-connections",
      actionLabel: "Open Connections",
    };
  }
  if (normalized.includes("discover")) {
    return {
      kind: "action",
      message: "Opening Discover for fresh people and communities.",
      action: "open-discover",
      actionLabel: "Open Discover",
    };
  }
  if (normalized.includes("open profile")) {
    return {
      kind: "action",
      message: "Opening your LinkUp profile.",
      action: "open-profile",
      actionLabel: "Open Profile",
    };
  }
  if (normalized.includes("open events")) {
    return {
      kind: "action",
      message: "Opening your upcoming events.",
      action: "open-events",
      actionLabel: "Open Events",
    };
  }
  if (normalized.includes("create")) {
    return {
      kind: "action",
      message: "I’ll take you to Events so you can start a new LinkUp.",
      action: "create-event",
      actionLabel: "Create event",
    };
  }
  if (normalized.includes("profile") || normalized.includes("edit")) {
    return {
      kind: "action",
      message: "Your profile is ready for an update.",
      action: "edit-profile",
      actionLabel: "Edit profile",
    };
  }
  if (normalized.includes("event") || normalized.includes("tomorrow")) {
    return {
      kind: "event",
      message: "This is the best event match for your network tomorrow.",
      action: "open-event",
      actionLabel: "Open event",
    };
  }
  if (
    normalized.includes("coffee") ||
    normalized.includes("westlands") ||
    normalized.includes("nearby")
  ) {
    return {
      kind: "person",
      message: "Brian is nearby and open to a quick coffee in Westlands.",
      action: "filter-attendees",
      actionLabel: "View attendees",
    };
  }
  if (normalized.includes("community")) {
    return {
      kind: "community",
      message: "This community has the strongest overlap with your interests.",
      action: "open-discover",
      actionLabel: "Explore community",
    };
  }
  if (normalized.includes("search")) {
    return {
      kind: "action",
      message: "Let’s search upcoming LinkUp events.",
      action: "search-events",
      actionLabel: "Search events",
    };
  }
  return {
    kind: "match",
    message: "I found an AI founder you should meet next.",
    action: "find-ai-matches",
    actionLabel: "See AI matches",
  };
}

export function LinkUpAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AssistantResult | null>(null);

  const runQuery = (nextQuery: string) => {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) return;
    setQuery(trimmedQuery);
    setResult(resultFor(trimmedQuery));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runQuery(query);
  };

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      const intention = (event as CustomEvent<{ intention?: string }>).detail
        ?.intention;
      if (!intention) return;
      setOpen(true);
      runQuery(intention);
    };

    window.addEventListener("linkup:assistant-prompt", handlePrompt);
    return () =>
      window.removeEventListener("linkup:assistant-prompt", handlePrompt);
  }, []);

  const performAction = (action: AssistantAction) => {
    const destinations: Partial<
      Record<
        AssistantAction,
        "/" | "/home" | "/discover" | "/connections" | "/profile"
      >
    > = {
      "open-home": "/home",
      "open-events": "/",
      "open-discover": "/discover",
      "open-connections": "/connections",
      "open-profile": "/profile",
      "open-event": "/",
      "create-event": "/",
      "edit-profile": "/profile",
      "filter-attendees": "/discover",
      "search-events": "/",
      "find-ai-matches": "/home",
    };
    const destination = destinations[action];
    window.dispatchEvent(
      new CustomEvent("linkup:assistant-action", { detail: { action } }),
    );
    if (destination) void navigate({ to: destination });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="gradient-brand fixed bottom-[calc(env(safe-area-inset-bottom)+6rem)] right-5 z-40 inline-flex min-h-14 items-center gap-2.5 overflow-hidden rounded-full px-5 font-display text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_oklch(0.21_0.035_258_/_0.16),0_20px_40px_-14px_oklch(0.546_0.215_262.9_/_0.62)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1 hover:shadow-[0_10px_20px_oklch(0.21_0.035_258_/_0.2),0_24px_44px_-14px_oklch(0.546_0.215_262.9_/_0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
      >
        <span className="absolute inset-0 bg-card/20 opacity-0 transition-opacity duration-200 active:opacity-100" />
        <Sparkles className="relative size-5" aria-hidden="true" />
        <span className="relative">Ask LinkUp</span>
      </button>

      <DrawerContent className="z-50 mx-auto h-[75dvh] max-w-md rounded-t-[2rem] border-border/70 bg-background shadow-[0_-16px_48px_oklch(0.21_0.035_258_/_0.18)]">
        <DrawerHeader className="px-5 pb-3 pt-4 text-left">
          <DrawerTitle className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            LinkUp AI
          </DrawerTitle>
          <DrawerDescription className="ml-11 text-sm font-medium">
            Your AI networking concierge.
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="mb-4 text-sm leading-6 text-muted-foreground">
                {result.message}
              </p>
              <AssistantResultCard result={result} onAction={performAction} />
            </div>
          ) : (
            <div className="pt-2">
              <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/[0.08] p-5">
                <p className="font-display text-base font-semibold text-foreground">
                  What can I help you discover?
                </p>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Ask for people, events, communities, or a shortcut around
                  LinkUp.
                </p>
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Try asking
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => runQuery(suggestion)}
                    className="min-h-11 rounded-full border border-border bg-card px-3 text-left text-xs font-semibold text-primary shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="absolute inset-x-0 bottom-0 border-t border-border/70 bg-card/95 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-1.5 shadow-[var(--shadow-soft)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/20">
            <Search
              className="ml-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask anything..."
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Send question"
              className="gradient-brand flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function AssistantResultCard({
  result,
  onAction,
}: {
  result: AssistantResult;
  onAction: (action: AssistantAction) => void;
}) {
  const actionButton = (className?: string) => (
    <button
      type="button"
      onClick={() => onAction(result.action)}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]",
        className,
      )}
    >
      {result.actionLabel}
    </button>
  );

  if (result.kind === "event")
    return (
      <div className="space-y-3">
        <EventCard
          title="AI Builders Nairobi"
          location="The Alchemist, Westlands"
          day="Tomorrow"
          time="6:30 PM"
          attendees={184}
          coverImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85"
          onEnter={() => onAction(result.action)}
        />
        {actionButton("w-full")}
      </div>
    );
  if (result.kind === "match")
    return (
      <div className="space-y-3">
        <MatchCard match={AI_MATCH} onConnect={() => onAction(result.action)} />
        {actionButton("w-full")}
      </div>
    );
  if (result.kind === "person")
    return (
      <PersonCard
        name="Brian Otieno"
        subtitle="AI Founder · 4 min away in Westlands"
        action={
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold text-success">
            Available
          </span>
        }
      >
        <p className="text-sm leading-5 text-muted-foreground">
          Open to a coffee and founder conversations until 4:30 PM.
        </p>
        <div className="mt-4">{actionButton()}</div>
      </PersonCard>
    );
  if (result.kind === "community")
    return (
      <CommunityCard
        title="Nairobi AI Builders"
        description="A welcoming community for founders, engineers, and AI product people."
        members={[
          "Amina Noor",
          "Brian Otieno",
          "David Mwangi",
          "Sarah Wanjiku",
        ]}
        action={actionButton()}
      />
    );
  return (
    <div className="surface-card rounded-3xl border border-border/70 p-5">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarPlus className="size-5" />
      </div>
      <p className="mt-4 font-display text-base font-semibold text-foreground">
        Ready when you are
      </p>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        I’ll keep your next networking step simple and focused.
      </p>
      <div className="mt-4">{actionButton()}</div>
    </div>
  );
}
