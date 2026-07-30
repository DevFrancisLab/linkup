import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  MessageCircle,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { AvatarPlaceholder } from "@/components/linkup/Avatar";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connections — LinkUp" },
      {
        name: "description",
        content: "Manage your networking connections in LinkUp.",
      },
    ],
  }),
  component: ConnectionsPage,
});

type ConnectionTab = "connected" | "pending" | "requests";

interface Connection {
  name: string;
  role: string;
  metAt: string;
  date: string;
  interests: string[];
  status: ConnectionTab;
  note?: string;
}

const CONNECTIONS: Connection[] = [
  {
    name: "Brian Otieno",
    role: "AI Founder · Nia Labs",
    metAt: "Matchmakers Hackathon Nairobi",
    date: "Connected 12 Aug",
    interests: ["AI Startups", "LLMs", "Fundraising"],
    status: "connected",
  },
  {
    name: "Sarah Wanjiku",
    role: "Product Designer · Koa",
    metAt: "Design Systems Nairobi",
    date: "Connected 10 Aug",
    interests: ["Design Systems", "Fintech"],
    status: "connected",
  },
  {
    name: "Kevin Muriuki",
    role: "Venture Partner · Savannah",
    metAt: "Founder Fridays",
    date: "Sent 14 Aug",
    interests: ["Startups", "Climate Tech"],
    status: "pending",
    note: "Waiting for a response",
  },
  {
    name: "Njeri Kamau",
    role: "Community Lead · The Alchemist",
    metAt: "AI Builders Nairobi",
    date: "Sent 13 Aug",
    interests: ["Community", "Events"],
    status: "pending",
    note: "Waiting for a response",
  },
  {
    name: "Kevin Mwangi",
    role: "Growth Lead · Pula",
    metAt: "Nairobi Tech Week Mixer",
    date: "Requested today",
    interests: ["Product Growth", "Fintech"],
    status: "requests",
    note: "You both met in the founder lounge.",
  },
  {
    name: "Maya Patel",
    role: "Creative Director · Kipepeo",
    metAt: "Creative Mornings",
    date: "Requested yesterday",
    interests: ["Brand Design", "Music"],
    status: "requests",
  },
];

function ConnectionCard({ connection }: { connection: Connection }) {
  const [responded, setResponded] = useState(false);
  const isRequest = connection.status === "requests";
  const isPending = connection.status === "pending";

  return (
    <article className="surface-card rounded-[1.45rem] border border-border/70 p-4">
      <div className="flex items-start gap-3">
        <AvatarPlaceholder name={connection.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-semibold tracking-tight">
                {connection.name}
              </h3>
              <p className="mt-0.5 truncate text-xs font-semibold text-muted-foreground">
                {connection.role}
              </p>
            </div>
            {isPending && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                Pending
              </span>
            )}
            {isRequest && !responded && (
              <span className="shrink-0 rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
                New request
              </span>
            )}
            {isRequest && responded && (
              <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold text-success">
                Connected
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5 text-primary" />
            <span className="truncate">Met at {connection.metAt}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5 text-primary" />
            {connection.date}
          </div>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {connection.interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary"
          >
            {interest}
          </span>
        ))}
      </div>
      {connection.note && (
        <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
          {connection.note}
        </p>
      )}
      {isRequest && !responded ? (
        <div className="mt-4 flex gap-2">
          <SecondaryButton
            onClick={() => setResponded(true)}
            className="h-10 min-h-10 flex-1 rounded-xl bg-primary/8 text-xs"
          >
            Ignore
          </SecondaryButton>
          <PrimaryButton
            onClick={() => setResponded(true)}
            className="h-10 min-h-10 flex-1 rounded-xl text-xs"
          >
            <Check className="size-4" />
            Accept
          </PrimaryButton>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <SecondaryButton className="h-10 min-h-10 flex-1 rounded-xl bg-primary/8 text-xs">
            View Profile
          </SecondaryButton>
          <PrimaryButton className="h-10 min-h-10 flex-1 rounded-xl text-xs">
            <MessageCircle className="size-4" />
            Message
          </PrimaryButton>
        </div>
      )}
    </article>
  );
}

function ConnectionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ConnectionTab>("connected");
  const [query, setQuery] = useState("");
  const filteredConnections = useMemo(
    () =>
      CONNECTIONS.filter(
        (connection) =>
          connection.status === activeTab &&
          `${connection.name} ${connection.role} ${connection.metAt}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [activeTab, query],
  );
  const tabLabels: Record<ConnectionTab, string> = {
    connected: "Connected",
    pending: "Pending",
    requests: "Requests",
  };
  const activity = [
    {
      icon: Check,
      text: "Brian accepted your request",
      time: "2m",
      color: "bg-success/15 text-success",
    },
    {
      icon: Eye,
      text: "Sarah viewed your profile",
      time: "1h",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: UserPlus,
      text: "Kevin wants to connect",
      time: "3h",
      color: "bg-secondary/10 text-secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-28">
        <header className="px-5 pb-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            LinkUp
          </p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
            Connections
          </h1>
          <label className="mt-5 flex h-13 items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 shadow-[var(--shadow-soft)] focus-within:ring-2 focus-within:ring-ring">
            <Search className="size-5 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search connections"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </label>
        </header>
        <div
          role="tablist"
          aria-label="Connection categories"
          className="mx-5 flex rounded-2xl bg-muted p-1"
        >
          {(Object.keys(tabLabels) as ConnectionTab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-10 flex-1 rounded-xl text-xs font-bold transition-all",
                activeTab === tab
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tabLabels[tab]}
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                  activeTab === tab
                    ? "bg-primary/8 text-primary"
                    : "bg-card/70",
                )}
              >
                {
                  CONNECTIONS.filter((connection) => connection.status === tab)
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        <main className="mt-7 space-y-9 px-5">
          <section aria-labelledby="connection-list-title">
            <div className="mb-3.5 flex items-center justify-between px-1">
              <div>
                <h2
                  id="connection-list-title"
                  className="font-display text-lg font-semibold tracking-tight"
                >
                  {tabLabels[activeTab]}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {activeTab === "connected"
                    ? "Your growing professional circle."
                    : activeTab === "pending"
                      ? "Requests you’ve sent out."
                      : "People ready to meet you."}
                </p>
              </div>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/8 text-primary">
                <Users className="size-4" />
              </span>
            </div>
            {filteredConnections.length ? (
              <div className="space-y-4">
                {filteredConnections.map((connection) => (
                  <ConnectionCard
                    key={connection.name}
                    connection={connection}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.45rem] border border-dashed border-border bg-card px-6 py-10 text-center">
                <Users className="mx-auto size-8 text-primary/50" />
                <p className="mt-3 font-display font-semibold">
                  No connections found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different name or tab.
                </p>
              </div>
            )}
          </section>
          <section aria-labelledby="activity-title">
            <div className="mb-3.5 flex items-center gap-1.5 px-1">
              <Sparkles className="size-4 text-secondary" />
              <h2
                id="activity-title"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Recent Activity
              </h2>
            </div>
            <div className="surface-card rounded-[1.45rem] border border-border/70 px-4">
              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className={cn(
                      "flex items-center gap-3 py-4",
                      index < activity.length - 1 &&
                        "border-b border-border/70",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                        item.color,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <p className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                      {item.text}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <Clock3 className="size-3" />
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
      <BottomNavigation
        activeId="connections"
        onChange={(id) => {
          if (id === "home") void navigate({ to: "/home" });
          if (id === "events") void navigate({ to: "/" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "profile") void navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
