import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/linkup/AppHeader";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { EmptyState } from "@/components/linkup/EmptyState";
import { WhatsNextCard } from "@/components/linkup/WhatsNextCard";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Home — LinkUp" }],
  }),
  component: HomeDashboard,
});

function HomeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.first_name || user?.username || "there";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-40">
        <AppHeader
          name={displayName}
          avatarUrl={user?.avatar}
          greeting="Good evening"
        />
        <main className="flex flex-col gap-8 px-5 pb-3">
          <WhatsNextCard />
          <section className="surface-card rounded-3xl border border-dashed border-border/70 p-5">
            <EmptyState
              title="Your event activity will appear here"
              description="Join an event to see attendees, matches, and networking updates."
            />
          </section>
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
