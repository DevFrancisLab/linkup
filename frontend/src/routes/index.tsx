import { createFileRoute } from "@tanstack/react-router";
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
      { property: "og:title", content: "LinkUp — AI Matches for Event Attendees" },
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
    reason: "Both interested in AI startups.",
  },
  {
    id: "sarah",
    name: "Sarah Wanjiku",
    profession: "Product Designer",
    matchPercent: 91,
    interests: ["Design Systems", "Fintech", "Prototyping"],
    reason: "You both build consumer products in Nairobi.",
  },
];

function HomeDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-28">
        <DashboardHeader name="Francis" greeting="Good evening" notificationCount={3} />

        <main className="flex flex-col gap-6 px-5">
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
                  className="text-sm font-medium text-primary"
                >
                  See all
                </button>
              }
            />
            <div className="flex flex-col gap-4">
              {MATCHES.map((match) => (
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
