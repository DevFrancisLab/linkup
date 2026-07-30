import { Minus, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIAvatar } from "./AIAvatar";

interface LinkUpAvatarAssistantProps {
  avatarUrl?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function LinkUpAvatarAssistant({
  avatarUrl,
  onOpenChange,
  open,
}: LinkUpAvatarAssistantProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!inset-0 h-dvh max-w-none !translate-x-0 !translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none sm:rounded-none [&>button:last-child]:hidden"
      >
        <DialogTitle className="sr-only">Talk with LinkUp Avatar</DialogTitle>
        <DialogDescription className="sr-only">
          A LinkUp AI avatar interface for spoken networking assistance.
        </DialogDescription>

        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-primary/[0.14] via-background to-secondary/[0.14]">
          <div className="pointer-events-none absolute -left-16 top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 bottom-8 size-64 rounded-full bg-secondary/20 blur-3xl" />

          <header className="relative z-10 flex items-center justify-between px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl gradient-brand text-primary-foreground shadow-[0_8px_20px_oklch(0.546_0.215_262.9_/_0.28)]">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-base font-semibold tracking-tight text-foreground">
                  LinkUp AI Avatar
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span className="size-2 rounded-full bg-success shadow-[0_0_0_4px_oklch(0.72_0.17_151_/_0.15)]" />
                  Ready to talk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-muted-foreground shadow-[var(--shadow-soft)] transition-[transform,background-color] duration-200 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97]"
                aria-label="Minimize LinkUp AI Avatar"
              >
                <Minus className="size-5" aria-hidden="true" />
              </button>
              <DialogClose className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-muted-foreground shadow-[var(--shadow-soft)] transition-[transform,background-color] duration-200 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97]">
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close LinkUp AI Avatar</span>
              </DialogClose>
            </div>
          </header>

          <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-5 pb-8">
            <AIAvatar avatarUrl={avatarUrl} />
          </main>

          <footer className="relative z-10 px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-center">
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              Your networking concierge
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-muted-foreground">
              Voice conversations are coming soon. LinkUp AI is ready to help
              you make your next meaningful connection.
            </p>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
