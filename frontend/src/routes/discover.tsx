import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { AvatarPlaceholder } from "@/components/linkup/Avatar";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton } from "@/components/linkup/Button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — LinkUp" },
      {
        name: "description",
        content:
          "Discover events, people and communities near you with LinkUp.",
      },
    ],
  }),
  component: DiscoverPage,
});

const CATEGORIES = [
  "Technology",
  "Business",
  "AI",
  "Design",
  "Music",
  "Community",
];

const TRENDING_EVENTS = [
  {
    id: "ai-builders",
    title: "AI Builders Nairobi",
    date: "Thu, 15 Aug · 6:30 PM",
    location: "The Alchemist, Westlands",
    source: "Luma",
    attendees: 184,
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "future-finance",
    title: "Future of Finance Forum",
    date: "Sat, 17 Aug · 10:00 AM",
    location: "Radisson Blu, Arboretum",
    source: "Eventbrite",
    attendees: 286,
    category: "Business",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "creative-sound",
    title: "Creative Sound Sessions",
    date: "Sun, 18 Aug · 3:00 PM",
    location: "The Mall, Westlands",
    source: "Meetup",
    attendees: 92,
    category: "Music",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=85",
  },
];

const PEOPLE = [
  {
    name: "Amina Noor",
    role: "AI Product Lead",
    interests: ["Generative AI", "Fintech"],
    reason: "You both turn emerging technology into products people love.",
  },
  {
    name: "David Mwangi",
    role: "Climate Founder",
    interests: ["Climate Tech", "Startups"],
    reason: "Your interest in impact-led ventures makes this a great match.",
  },
  {
    name: "Wanjiku Kimani",
    role: "Brand Designer",
    interests: ["Design Systems", "Community"],
    reason: "AI noticed your shared love of thoughtful, inclusive experiences.",
  },
];

const COMMUNITIES = [
  {
    name: "AI Kenya",
    members: "8.4k",
    events: 3,
    icon: "✦",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Women in Tech",
    members: "5.2k",
    events: 2,
    icon: "✺",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Startup Founders",
    members: "3.8k",
    events: 4,
    icon: "↗",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Climate Tech",
    members: "2.1k",
    events: 1,
    icon: "◌",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const SOURCE_STYLE: Record<string, string> = {
  Luma: "bg-violet-100 text-violet-700",
  Eventbrite: "bg-orange-100 text-orange-700",
  Meetup: "bg-rose-100 text-rose-700",
  LinkUp: "bg-primary text-primary-foreground",
};

function DiscoverPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [connectedPeople, setConnectedPeople] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);

  const events = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return TRENDING_EVENTS.filter(
      (event) =>
        (activeCategory === "All" || event.category === activeCategory) &&
        `${event.title} ${event.location}`
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-28">
        <header className="px-5 pb-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            LinkUp
          </p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
            Discover
          </h1>
          <label className="mt-5 flex h-13 items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 shadow-[var(--shadow-soft)] focus-within:ring-2 focus-within:ring-ring">
            <Search className="size-5 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events or people..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </label>
        </header>

        <div
          className="scrollbar-none flex gap-2 overflow-x-auto px-5 pb-1"
          aria-label="Event categories"
        >
          {["All", ...CATEGORIES].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-[0_4px_10px_oklch(0.546_0.215_262.9_/_0.22)]"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <main className="mt-7 space-y-9">
          <section aria-labelledby="trending-events-title">
            <div className="mb-3.5 flex items-center justify-between px-5">
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-secondary" />
                  <h2
                    id="trending-events-title"
                    className="font-display text-lg font-semibold tracking-tight"
                  >
                    Trending Events
                  </h2>
                </div>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  The conversations everyone’s joining.
                </p>
              </div>
              <ChevronRight className="size-5 text-primary" />
            </div>
            <div className="scrollbar-none flex snap-x gap-4 overflow-x-auto px-5 pb-1">
              {events.map((event) => {
                const joined = joinedEvents.includes(event.id);
                return (
                  <article
                    key={event.id}
                    className="surface-card w-[284px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-border/70"
                  >
                    <div className="relative h-36">
                      <img
                        src={event.image}
                        alt=""
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 to-transparent" />
                      <span
                        className={cn(
                          "absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm",
                          SOURCE_STYLE[event.source],
                        )}
                      >
                        {event.source}
                      </span>
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-1 text-[11px] font-bold text-foreground shadow-sm">
                        <Users className="size-3" />
                        {event.attendees}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base font-semibold leading-snug">
                        {event.title}
                      </h3>
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <CalendarDays className="size-3.5 text-primary" />
                        {event.date}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs font-semibold text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        {event.location}
                      </p>
                      <PrimaryButton
                        onClick={() =>
                          setJoinedEvents((current) =>
                            joined
                              ? current.filter((id) => id !== event.id)
                              : [...current, event.id],
                          )
                        }
                        className={cn(
                          "mt-4 h-10 w-full min-h-10 rounded-xl text-xs",
                          joined &&
                            "bg-success text-success-foreground shadow-none",
                        )}
                      >
                        {joined ? "Networking joined" : "Join Networking"}
                      </PrimaryButton>
                    </div>
                  </article>
                );
              })}
              {!events.length && (
                <div className="w-full rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
                  No events in this category yet.
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="people-title">
            <div className="mb-3.5 px-5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-secondary" />
                <h2
                  id="people-title"
                  className="font-display text-lg font-semibold tracking-tight"
                >
                  People You Should Meet
                </h2>
              </div>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Handpicked by LinkUp AI for you.
              </p>
            </div>
            <div className="scrollbar-none flex snap-x gap-4 overflow-x-auto px-5 pb-1">
              {PEOPLE.map((person) => {
                const connected = connectedPeople.includes(person.name);
                return (
                  <article
                    key={person.name}
                    className="surface-card w-[274px] shrink-0 snap-start rounded-[1.5rem] border border-border/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <AvatarPlaceholder name={person.name} size="lg" />
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base font-semibold">
                          {person.name}
                        </h3>
                        <p className="truncate text-xs font-semibold text-muted-foreground">
                          {person.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {person.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 min-h-10 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-bold text-secondary">
                        Why AI recommends you:{" "}
                      </span>
                      {person.reason}
                    </p>
                    <PrimaryButton
                      onClick={() =>
                        setConnectedPeople((current) =>
                          connected
                            ? current.filter((name) => name !== person.name)
                            : [...current, person.name],
                        )
                      }
                      className={cn(
                        "mt-4 h-10 w-full min-h-10 rounded-xl text-xs",
                        connected &&
                          "bg-success text-success-foreground shadow-none",
                      )}
                    >
                      {connected ? "Connected" : "Connect"}
                    </PrimaryButton>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="communities-title" className="px-5">
            <div className="mb-3.5">
              <h2
                id="communities-title"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Popular Communities
              </h2>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                Find your people, beyond one event.
              </p>
            </div>
            <div className="grid gap-3">
              {COMMUNITIES.map((community) => {
                const joined = joinedCommunities.includes(community.name);
                return (
                  <article
                    key={community.name}
                    className="surface-card flex items-center gap-3 rounded-[1.3rem] border border-border/70 p-3"
                  >
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold",
                        community.color,
                      )}
                    >
                      {community.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-sm font-semibold">
                        {community.name}
                      </h3>
                      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                        {community.members} members · {community.events}{" "}
                        upcoming {community.events === 1 ? "event" : "events"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setJoinedCommunities((current) =>
                          joined
                            ? current.filter((name) => name !== community.name)
                            : [...current, community.name],
                        )
                      }
                      className={cn(
                        "min-h-9 rounded-xl px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        joined
                          ? "bg-success/15 text-success"
                          : "bg-primary/8 text-primary hover:bg-primary/12",
                      )}
                    >
                      {joined ? "Joined" : "Join"}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
      <BottomNavigation
        activeId="discover"
        onChange={(id) => {
          if (id === "home") void navigate({ to: "/home" });
          if (id === "events") void navigate({ to: "/" });
          if (id === "connections") void navigate({ to: "/connections" });
          if (id === "profile") void navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
