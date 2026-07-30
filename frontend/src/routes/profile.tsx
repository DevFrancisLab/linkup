import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  LogOut,
  Pencil,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { AvatarPlaceholder } from "@/components/linkup/Avatar";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — LinkUp" },
      { name: "description", content: "Your LinkUp networking profile." },
    ],
  }),
  component: ProfilePage,
});

const INTERESTS = [
  "AI Startups",
  "Product Strategy",
  "Community",
  "Climate Tech",
];
const LOOKING_FOR = [
  "Co-founders",
  "Meaningful connections",
  "Investor conversations",
];

function SettingsRow({
  icon: Icon,
  title,
  detail,
  destructive = false,
}: {
  icon: typeof Bell;
  title: string;
  detail?: string;
  destructive?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${destructive ? "text-destructive" : "text-foreground"}`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${destructive ? "bg-destructive/10" : "bg-primary/8 text-primary"}`}
      >
        <Icon className="size-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {detail && (
          <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
            {detail}
          </span>
        )}
      </span>
      {!destructive && (
        <ChevronRight className="size-4 text-muted-foreground" />
      )}
    </button>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [qrVisible, setQrVisible] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-28">
        <header className="flex items-center justify-between px-5 pb-4 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              LinkUp
            </p>
            <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
              Profile
            </h1>
          </div>
          <button
            aria-label="Share profile"
            className="flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="size-5" />
          </button>
        </header>
        <main className="space-y-7 px-5">
          <section className="surface-card relative overflow-hidden rounded-[1.75rem] border border-border/70 px-5 pb-5 pt-6 text-center">
            <div className="pointer-events-none absolute -right-12 -top-14 size-36 rounded-full bg-secondary/12 blur-3xl" />
            <div className="relative">
              <div className="mx-auto w-fit rounded-full bg-card p-1.5 shadow-[var(--shadow-raised)]">
                <AvatarPlaceholder name="Francis Kariuki" size="xl" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
                Francis Kariuki
              </h2>
              <p className="mt-1 text-sm font-semibold text-primary">
                Product Builder · LinkUp
              </p>
              <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
                Building community-first products and looking for the next
                thoughtful conversation.
              </p>
              <div className="mt-5 flex gap-2">
                <SecondaryButton className="h-11 flex-1 rounded-xl bg-primary/8 text-xs">
                  <Pencil className="size-4" />
                  Edit Profile
                </SecondaryButton>
                <PrimaryButton className="h-11 min-h-11 flex-1 rounded-xl text-xs">
                  <Share2 className="size-4" />
                  Share Profile
                </PrimaryButton>
              </div>
            </div>
          </section>
          <section
            aria-label="Profile statistics"
            className="grid grid-cols-3 gap-2.5"
          >
            <div className="surface-card rounded-[1.3rem] border border-border/70 px-2 py-4 text-center">
              <CalendarDays className="mx-auto size-4 text-primary" />
              <p className="mt-2 font-display text-xl font-semibold">12</p>
              <p className="mt-1 text-[10px] font-bold leading-tight text-muted-foreground">
                Events attended
              </p>
            </div>
            <div className="surface-card rounded-[1.3rem] border border-border/70 px-2 py-4 text-center">
              <Users className="mx-auto size-4 text-secondary" />
              <p className="mt-2 font-display text-xl font-semibold">48</p>
              <p className="mt-1 text-[10px] font-bold leading-tight text-muted-foreground">
                Connections
              </p>
            </div>
            <div className="surface-card rounded-[1.3rem] border border-border/70 px-2 py-4 text-center">
              <Sparkles className="mx-auto size-4 text-success" />
              <p className="mt-2 font-display text-xl font-semibold">6</p>
              <p className="mt-1 text-[10px] font-bold leading-tight text-muted-foreground">
                Communities
              </p>
            </div>
          </section>
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Your interests
              </h2>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                The topics that spark your best conversations.
              </p>
            </div>
            <div className="surface-card rounded-[1.45rem] border border-border/70 p-4">
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-primary/8 px-3 py-2 text-xs font-bold text-primary"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Looking for
              </h2>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Let people know how they can help.
              </p>
            </div>
            <div className="surface-card rounded-[1.45rem] border border-border/70 p-4">
              <div className="space-y-3">
                {LOOKING_FOR.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <Sparkles className="size-3.5" />
                    </span>
                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section>
            <button
              onClick={() => setQrVisible((visible) => !visible)}
              className="gradient-brand flex w-full items-center justify-between rounded-[1.45rem] px-5 py-4 text-left text-primary-foreground shadow-[var(--shadow-raised)]"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-card/15">
                  <QrCode className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold">
                    Generate My QR
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-primary-foreground/75">
                    Make connecting effortless at events.
                  </span>
                </span>
              </span>
              <ChevronRight
                className={`size-5 transition-transform ${qrVisible ? "rotate-90" : ""}`}
              />
            </button>
            {qrVisible && (
              <div className="mt-3 rounded-[1.45rem] border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
                <div className="mx-auto grid size-36 grid-cols-7 gap-1 rounded-xl bg-foreground p-3">
                  {Array.from({ length: 49 }, (_, index) => (
                    <span
                      key={index}
                      className={
                        (index * 7 + index * index) % 5 === 0 ||
                        index % 11 === 0
                          ? "rounded-[1px] bg-card"
                          : ""
                      }
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  Scan to connect with Francis on LinkUp
                </p>
              </div>
            )}
          </section>
          <section aria-labelledby="settings-title">
            <h2
              id="settings-title"
              className="mb-3 font-display text-lg font-semibold tracking-tight"
            >
              Settings
            </h2>
            <div className="surface-card divide-y divide-border/70 overflow-hidden rounded-[1.45rem] border border-border/70">
              <SettingsRow
                icon={Bell}
                title="Notifications"
                detail="Manage your alerts"
              />
              <SettingsRow
                icon={ShieldCheck}
                title="Privacy"
                detail="Control who sees your profile"
              />
              <SettingsRow
                icon={CircleHelp}
                title="Help"
                detail="Get support from LinkUp"
              />
              <SettingsRow icon={LogOut} title="Logout" destructive />
            </div>
          </section>
        </main>
      </div>
      <BottomNavigation
        activeId="profile"
        onChange={(id) => {
          if (id === "home") void navigate({ to: "/home" });
          if (id === "events") void navigate({ to: "/" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "connections") void navigate({ to: "/connections" });
        }}
      />
    </div>
  );
}
