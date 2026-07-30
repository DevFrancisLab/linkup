import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Filter,
  MapPin,
  Plus,
  Search,
  Share2,
  Users,
  X,
} from "lucide-react";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Events — LinkUp" },
      {
        name: "description",
        content: "Manage the events you have joined and created in LinkUp.",
      },
    ],
  }),
  component: EventsPage,
});

type EventSource = "LinkUp" | "Luma" | "Eventbrite" | "Meetup";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  source: EventSource;
  status: string;
  image: string;
  kind: "upcoming" | "created" | "past";
}

const EVENTS: Event[] = [
  {
    id: "product-safari",
    title: "Product Safari: The AI Edition",
    location: "The Alchemist, Westlands",
    date: "Thu, 15 Aug",
    time: "6:00 PM – 9:00 PM",
    attendees: 128,
    source: "LinkUp",
    status: "Going",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    kind: "upcoming",
  },
  {
    id: "design-systems",
    title: "Design Systems Nairobi",
    location: "Nairobi Garage, Kilimani",
    date: "Sat, 24 Aug",
    time: "10:00 AM",
    attendees: 76,
    source: "Luma",
    status: "Going",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85",
    kind: "upcoming",
  },
  {
    id: "founder-fridays",
    title: "Founder Fridays: Build in Public",
    location: "Ikigai, Lower Kabete",
    date: "Fri, 30 Aug",
    time: "5:30 PM",
    attendees: 54,
    source: "Meetup",
    status: "Waitlist",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
    kind: "upcoming",
  },
  {
    id: "creative-mornings",
    title: "Creative Mornings: Connection",
    location: "The Social House, Lavington",
    date: "Fri, 6 Sep",
    time: "8:30 AM",
    attendees: 42,
    source: "LinkUp",
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09f6af77a4?auto=format&fit=crop&w=900&q=85",
    kind: "created",
  },
  {
    id: "tech-week",
    title: "Nairobi Tech Week Mixer",
    location: "KICC, Nairobi",
    date: "2 Aug 2025",
    time: "4:00 PM",
    attendees: 310,
    source: "Eventbrite",
    status: "Attended",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
    kind: "past",
  },
];

const sourceStyles: Record<EventSource, string> = {
  LinkUp: "bg-primary text-primary-foreground",
  Luma: "bg-violet-100 text-violet-700",
  Eventbrite: "bg-orange-100 text-orange-700",
  Meetup: "bg-rose-100 text-rose-700",
};

function SourceBadge({ source }: { source: EventSource }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold tracking-wide shadow-sm",
        sourceStyles[source],
      )}
    >
      {source}
    </span>
  );
}

function EventListCard({ event }: { event: Event }) {
  return (
    <article className="surface-card overflow-hidden rounded-[1.45rem] border border-border/70">
      <div className="relative h-36 overflow-hidden">
        <img src={event.image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <SourceBadge source={event.source} />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur-sm">
          {event.status}
        </span>
      </div>
      <div className="p-4 pb-3">
        <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-foreground">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-xs font-medium text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-primary" />
            {event.date} · {event.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5 text-primary" />
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-3.5 text-primary" />
            {event.attendees} attendees
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
          <SecondaryButton className="min-h-9 flex-1 rounded-xl bg-primary/7 px-3 text-xs">
            Open
          </SecondaryButton>
          <button
            aria-label={`Share ${event.title}`}
            className="flex size-9 items-center justify-center rounded-xl text-primary transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function EventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Event["kind"]>("upcoming");
  const [activeNavigation, setActiveNavigation] = useState("events");
  const [isSearching, setIsSearching] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const [query, setQuery] = useState("");
  const hero = EVENTS[0];
  const visibleEvents = EVENTS.filter((event) => {
    const matchesTab = event.kind === activeTab;
    const matchesSearch = event.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = !filterOn || event.source === "LinkUp";
    return matchesTab && matchesSearch && matchesFilter && event.id !== hero.id;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-36">
        <header className="flex min-h-22 items-center justify-between px-5 pb-3 pt-6">
          {isSearching ? (
            <div className="flex w-full items-center gap-2 rounded-2xl bg-card px-3 shadow-[var(--shadow-soft)] ring-1 ring-border">
              <Search className="size-5 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your events"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => {
                  setIsSearching(false);
                  setQuery("");
                }}
                aria-label="Close search"
                className="p-1 text-muted-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  LinkUp
                </p>
                <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
                  Events
                </h1>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsSearching(true)}
                  aria-label="Search events"
                  className="flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="size-5" />
                </button>
                <button
                  onClick={() => setFilterOn((current) => !current)}
                  aria-pressed={filterOn}
                  aria-label="Filter events"
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full shadow-[var(--shadow-soft)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filterOn
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground",
                  )}
                >
                  <Filter className="size-5" />
                </button>
              </div>
            </>
          )}
        </header>

        <div className="px-5">
          <div
            role="tablist"
            aria-label="Event categories"
            className="flex rounded-2xl bg-muted p-1"
          >
            {(["upcoming", "created", "past"] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-10 flex-1 rounded-xl text-sm font-semibold capitalize transition-all",
                  activeTab === tab
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <main className="mt-6 space-y-8 px-5">
          {activeTab === "upcoming" && !query && !filterOn && (
            <section aria-labelledby="next-event-heading">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="size-2 rounded-full bg-success shadow-[0_0_0_4px_oklch(0.696_0.17_162.5_/_0.14)]" />
                <h2
                  id="next-event-heading"
                  className="font-display text-lg font-semibold tracking-tight"
                >
                  Up next
                </h2>
              </div>
              <article className="relative overflow-hidden rounded-[1.75rem] bg-foreground shadow-[var(--shadow-raised)]">
                <img
                  src={hero.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/75 to-foreground/10" />
                <div className="relative flex min-h-[390px] flex-col p-5 text-primary-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-success/90 px-3 py-1.5 text-xs font-bold text-success-foreground">
                      <span className="size-1.5 rounded-full bg-success-foreground" />{" "}
                      Happening soon
                    </span>
                    <SourceBadge source={hero.source} />
                  </div>
                  <div className="mt-auto">
                    <h2 className="max-w-[17rem] font-display text-[1.8rem] font-semibold leading-[1.08] tracking-tight">
                      {hero.title}
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-primary-foreground/90">
                      <span className="flex items-center gap-1.5 rounded-xl bg-card/12 px-2.5 py-2.5 backdrop-blur-sm">
                        <CalendarDays className="size-4 text-accent" />
                        {hero.date}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-xl bg-card/12 px-2.5 py-2.5 backdrop-blur-sm">
                        <Clock3 className="size-4 text-accent" />
                        {hero.time}
                      </span>
                      <span className="col-span-2 flex items-center gap-1.5 rounded-xl bg-card/12 px-2.5 py-2.5 backdrop-blur-sm">
                        <MapPin className="size-4 text-accent" />
                        {hero.location}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
                      <span className="flex size-7 items-center justify-center rounded-full bg-success/20 text-success">
                        <Users className="size-4" />
                      </span>
                      {hero.attendees} people are going
                    </p>
                    <div className="mt-5 flex gap-2.5">
                      <PrimaryButton className="h-12 flex-1 rounded-xl bg-card text-primary shadow-none hover:shadow-md">
                        Enter Event
                      </PrimaryButton>
                      <button className="h-12 flex-1 rounded-xl border border-card/35 bg-card/10 px-3 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-card/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-card">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          )}

          <section aria-labelledby="upcoming-events-heading">
            <div className="mb-3.5 flex items-center justify-between px-1">
              <div>
                <h2
                  id="upcoming-events-heading"
                  className="font-display text-lg font-semibold tracking-tight text-foreground"
                >
                  {activeTab === "upcoming"
                    ? "Upcoming Events"
                    : activeTab === "created"
                      ? "Created by you"
                      : "Past Events"}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {activeTab === "upcoming"
                    ? "Your plans, all in one place."
                    : activeTab === "created"
                      ? "Events you’re bringing to life."
                      : "A look back at your connections."}
                </p>
              </div>
              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary">
                {visibleEvents.length +
                  (activeTab === "upcoming" && !query && !filterOn ? 1 : 0)}
              </span>
            </div>
            {visibleEvents.length ? (
              <div className="grid gap-4">
                {visibleEvents.map((event) => (
                  <EventListCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="surface-card rounded-[1.45rem] border border-dashed border-border px-6 py-10 text-center">
                <CalendarDays className="mx-auto size-8 text-primary/55" />
                <p className="mt-3 font-display font-semibold">
                  No events found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search or filter.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
      <button className="fixed bottom-25 right-5 z-10 inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 font-display text-sm font-bold text-primary-foreground shadow-[var(--shadow-raised)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Plus className="size-5" />
        Create Event
      </button>
      <BottomNavigation
        activeId={activeNavigation}
        onChange={(id) => {
          setActiveNavigation(id);
          if (id === "home") void navigate({ to: "/home" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "connections") void navigate({ to: "/connections" });
          if (id === "profile") void navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
