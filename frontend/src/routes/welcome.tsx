import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — LinkUp" }] }),
  component: WelcomePage,
});

const BENEFITS = [
  {
    icon: BrainCircuit,
    title: "AI Matching",
    description: "Meet people with shared goals and real chemistry.",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: UsersRound,
    title: "Smart Networking",
    description: "Turn every hello into a more meaningful connection.",
    tint: "bg-secondary/10 text-secondary",
  },
  {
    icon: CalendarDays,
    title: "Discover Events",
    description: "Find rooms where your next opportunity is waiting.",
    tint: "bg-accent/15 text-accent-foreground",
  },
];

function NetworkingIllustration() {
  return (
    <div className="relative mx-auto h-65 w-full max-w-85 overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/18 via-card to-secondary/16 shadow-[var(--shadow-raised)]">
      <div className="pointer-events-none absolute -left-10 top-1 size-36 rounded-full bg-primary/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-0 size-32 rounded-full bg-secondary/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/12 to-transparent" />
      <span className="absolute left-[18%] top-11 size-2 rounded-full bg-primary/45 shadow-[0_0_0_6px_oklch(0.546_0.215_262.9_/_0.08)]" />
      <span className="absolute right-[18%] top-16 size-2 rounded-full bg-secondary/50 shadow-[0_0_0_6px_oklch(0.541_0.281_293_/_0.08)]" />
      <div className="absolute left-1/2 top-[47%] h-px w-40 -translate-x-1/2 -rotate-12 bg-gradient-to-r from-primary/5 via-primary/45 to-secondary/10" />
      <div className="absolute left-1/2 top-[48%] h-px w-34 -translate-x-1/2 rotate-[17deg] bg-gradient-to-r from-secondary/10 via-secondary/45 to-primary/5" />
      <div className="absolute left-1/2 top-[43%] flex size-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary to-secondary text-xl font-bold text-primary-foreground shadow-[0_12px_24px_oklch(0.546_0.215_262.9_/_0.3)]">
        FK
      </div>
      <div className="absolute left-[13%] top-[56%] flex size-16 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-brand-cyan to-primary text-base font-bold text-primary-foreground shadow-[0_8px_18px_oklch(0.546_0.215_262.9_/_0.22)]">
        AN
      </div>
      <div className="absolute right-[12%] top-[56%] flex size-16 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-secondary to-brand-purple text-base font-bold text-primary-foreground shadow-[0_8px_18px_oklch(0.541_0.281_293_/_0.22)]">
        BO
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-card/60 bg-card/75 px-3 py-2 text-[11px] font-bold text-foreground shadow-[var(--shadow-soft)] backdrop-blur-md">
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
        Better together
      </div>
    </div>
  );
}

function WelcomePage() {
  const navigate = useNavigate();

  const continueToLinkUp = () => void navigate({ to: "/auth" });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-100 bg-[radial-gradient(circle_at_50%_0%,oklch(0.546_0.215_262.9_/_0.2),transparent_66%)]" />
      <div className="relative mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center">
          <img
            src="/linkuplogo.png"
            alt="LinkUp"
            className="size-12 rounded-2xl object-contain shadow-[var(--shadow-raised)]"
          />
        </div>
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Welcome to LinkUp
        </p>
        <div className="mt-5">
          <NetworkingIllustration />
        </div>
        <header className="mt-8 text-center">
          <h1 className="font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground">
            Meet meaningful people,
            <br />
            not just attendees.
          </h1>
          <p className="mx-auto mt-4 max-w-72 text-sm font-medium leading-6 text-muted-foreground">
            Discover events. Find your people. Build lasting connections.
          </p>
        </header>
        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={continueToLinkUp}
            className="gradient-brand inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-raised)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_10px_22px_oklch(0.546_0.215_262.9_/_0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={continueToLinkUp}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-border/80 bg-card px-5 font-display text-sm font-semibold text-primary shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
          >
            Sign In
          </button>
        </div>
        <section className="mt-10" aria-labelledby="why-linkup-title">
          <h2
            id="why-linkup-title"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            Why LinkUp?
          </h2>
          <div className="mt-4 grid gap-3">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="surface-card flex items-center gap-4 rounded-3xl border border-border/70 p-4 shadow-[var(--shadow-soft)]"
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45),0_5px_12px_oklch(0.21_0.035_258_/_0.08)] ${benefit.tint}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
