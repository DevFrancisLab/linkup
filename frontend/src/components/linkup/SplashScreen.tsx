import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  isLeaving?: boolean;
}

export function SplashScreen({ isLeaving = false }: SplashScreenProps) {
  return (
    <main
      aria-label="Loading LinkUp"
      className={`relative flex min-h-screen overflow-hidden bg-foreground px-6 text-primary-foreground transition-opacity duration-500 motion-reduce:transition-none ${isLeaving ? "opacity-0" : "animate-in fade-in duration-500"}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,oklch(0.646_0.222_262.9_/_0.76),transparent_34%),radial-gradient(circle_at_82%_78%,oklch(0.541_0.281_293_/_0.7),transparent_38%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 size-64 rounded-full bg-brand-cyan/25 blur-3xl animate-pulse motion-reduce:animate-none" />
      <div className="pointer-events-none absolute -right-24 bottom-8 size-72 rounded-full bg-brand-purple/40 blur-3xl animate-pulse [animation-delay:700ms] motion-reduce:animate-none" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(oklch(1_0_0_/_0.07)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0_/_0.07)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center pb-[env(safe-area-inset-bottom)] text-center">
        <div className="flex size-24 items-center justify-center rounded-[2rem] border border-primary-foreground/20 bg-card/15 shadow-[0_12px_36px_oklch(0.21_0.035_258_/_0.32)] backdrop-blur-md animate-in zoom-in-95 duration-500">
          <img
            src="/linkuplogo.png"
            alt="LinkUp"
            className="size-16 rounded-[1.35rem] object-contain shadow-[0_8px_18px_oklch(0.21_0.035_258_/_0.2)]"
          />
        </div>
        <div className="mt-7 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:150ms]">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Your event network
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            LinkUp
          </h1>
          <p className="mx-auto mt-3 max-w-65 text-base leading-6 text-primary-foreground/78">
            Meet the right people at every event.
          </p>
        </div>
        <div className="mt-14 flex items-center gap-3 text-sm font-medium text-primary-foreground/70 animate-in fade-in duration-500 [animation-delay:300ms]">
          <span className="relative flex size-5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-5 rounded-full border-2 border-primary-foreground/35 border-t-accent" />
          </span>
          Preparing your network
        </div>
      </div>
    </main>
  );
}
