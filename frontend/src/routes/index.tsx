import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ActiveEventCard } from "@/components/linkup/ActiveEventCard";
import { BottomNav } from "@/components/linkup/BottomNav";
import { DashboardHeader } from "@/components/linkup/DashboardHeader";
import { MatchCard, type Match } from "@/components/linkup/MatchCard";
import { RecentActivity } from "@/components/linkup/RecentActivity";
import { SectionHeading } from "@/components/linkup/SectionHeading";
import { WhatsNextCard } from "@/components/linkup/WhatsNextCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LinkUp — AI Matches for Event Attendees" },
      {
        name: "description",
        content:
          "LinkUp helps event attendees find meaningful connections with AI matches, shared interests and instant meetups.",
      },
      {
        property: "og:title",
        content: "LinkUp — AI Matches for Event Attendees",
      },
      {
        property: "og:description",
        content:
          "Discover your best matches at any event: AI reasons, shared interests and one-tap connections.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
  const [showAllMatches, setShowAllMatches] = useState(false);
  const visibleMatches = showAllMatches ? MATCHES : MATCHES.slice(0, 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-32">
        <DashboardHeader
          name="Francis"
          greeting="Good evening"
          notificationCount={3}
        />

        <main className="flex flex-col gap-7 px-5 pb-2">
          <ActiveEventCard
            title="Matchmakers Hackathon Nairobi"
            location="Nairobi, Kenya"
            day="Today"
            attendees={234}
          />

          <section>
            <SectionHeading
              title="Your AI Matches"
              action={
                <button
                  type="button"
                  aria-controls="ai-matches"
                  aria-expanded={showAllMatches}
                  onClick={() => setShowAllMatches((previous) => !previous)}
                  className="min-h-11 rounded-xl px-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-primary/12"
                >
                  {showAllMatches ? "Show less" : `See all (${MATCHES.length})`}
                </button>
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

      <BottomNav />
    </div>
  );
}
