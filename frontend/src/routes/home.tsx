import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/linkup/AppHeader";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { SecondaryButton } from "@/components/linkup/Button";
import { EventCard } from "@/components/linkup/EventCard";
import { MatchCard, type Match } from "@/components/linkup/MatchCard";
import { RecentActivity } from "@/components/linkup/RecentActivity";
import { SectionHeading } from "@/components/linkup/SectionHeading";
import { WhatsNextCard } from "@/components/linkup/WhatsNextCard";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Home — LinkUp" }],
  }),
  component: HomeDashboard,
});

const MATCHES: Match[] = [
  {
    id: "brian",
    name: "Brian Otieno",
    profession: "AI Founder",
    matchPercent: 96,
    interests: ["AI Startups", "LLMs", "Fundraising"],
    reason:
      "Recommended because you both build AI startups and are looking to network at the hackathon today.",
  },
  {
    id: "sarah",
    name: "Sarah Wanjiku",
    profession: "Product Designer",
    matchPercent: 91,
    interests: ["Design Systems", "Fintech", "Prototyping"],
    reason:
      "Recommended because you both build consumer products and share an interest in fast, collaborative prototyping.",
  },
];

function HomeDashboard() {
  const navigate = useNavigate();
  const [showAllMatches, setShowAllMatches] = useState(false);
  const visibleMatches = showAllMatches ? MATCHES : MATCHES.slice(0, 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-32">
        <AppHeader
          name="Francis"
          greeting="Good evening"
          notificationCount={3}
        />
        <main className="flex flex-col gap-8 px-5 pb-3">
          <EventCard
            title="Matchmakers Hackathon Nairobi"
            location="Nairobi, Kenya"
            day="Today"
            attendees={234}
          />
          <section>
            <SectionHeading
              title="Your AI Matches"
              action={
                <SecondaryButton
                  aria-controls="ai-matches"
                  aria-expanded={showAllMatches}
                  onClick={() => setShowAllMatches((previous) => !previous)}
                  className="px-2"
                >
                  {showAllMatches ? "Show less" : `See all (${MATCHES.length})`}
                </SecondaryButton>
              }
            />
            <p className="-mt-1 mb-4 px-1 text-sm text-muted-foreground">
              People AI thinks you should meet at this event.
            </p>
            <div id="ai-matches" className="flex flex-col gap-4">
              {visibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
          <WhatsNextCard />
          <RecentActivity />
        </main>
      </div>
      <BottomNavigation
        activeId="home"
        onChange={(id) => {
          if (id === "events") void navigate({ to: "/" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "connections") void navigate({ to: "/connections" });
          if (id === "profile") void navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
