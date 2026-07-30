import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AvatarPlaceholder } from "@/components/linkup/Avatar";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";
import { eventsService } from "@/services/events";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = Number(eventId);
  const [showAttendees, setShowAttendees] = useState(false);
  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsService.get(id),
  });
  const attendeesQuery = useQuery({
    queryKey: ["event", id, "attendees"],
    queryFn: () => eventsService.attendees(id),
  });
  const joinMutation = useMutation({
    mutationFn: () => eventsService.join(id),
    onSuccess: (event) => {
      queryClient.setQueryData(["event", id], event);
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({
        queryKey: ["event", id, "attendees"],
      });
      toast.success("You are going to this event.");
    },
  });
  const leaveMutation = useMutation({
    mutationFn: () => eventsService.leave(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["event", id] });
      void queryClient.invalidateQueries({
        queryKey: ["event", id, "attendees"],
      });
      toast.success("You left this event.");
    },
  });
  const event = eventQuery.data;
  const start = event ? new Date(event.start_datetime) : undefined;
  const end = event ? new Date(event.end_datetime) : undefined;
  const organizerName = event
    ? `${event.organizer.first_name} ${event.organizer.last_name}`.trim() ||
      event.organizer.username
    : "";

  if (eventQuery.isLoading) {
    return <main className="mx-auto max-w-md p-5">Loading event…</main>;
  }
  if (!event) {
    return <main className="mx-auto max-w-md p-5">Event not found.</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-background px-5 pb-10 pt-6">
      <button
        type="button"
        onClick={() => void navigate({ to: "/" })}
        className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to events
      </button>
      {event.cover_image && (
        <img
          src={event.cover_image}
          alt=""
          className="h-52 w-full rounded-3xl object-cover shadow-[var(--shadow-raised)]"
        />
      )}
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {event.category}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {event.title}
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {event.description}
      </p>
      <div className="mt-6 flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-4">
        <AvatarPlaceholder
          name={organizerName}
          imageUrl={event.organizer.avatar}
        />
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Organized by
          </p>
          <p className="font-display text-sm font-semibold">{organizerName}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 rounded-3xl border border-border/70 bg-card p-4 text-sm">
        <p className="flex items-center gap-3">
          <CalendarDays className="size-4 text-primary" />
          {start?.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="flex items-center gap-3">
          <Clock3 className="size-4 text-primary" />
          {start?.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {end?.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        <p className="flex items-center gap-3">
          <MapPin className="size-4 text-primary" />
          {event.venue}, {event.city}, {event.country}
        </p>
        <p className="flex items-center gap-3">
          <Users className="size-4 text-primary" />
          {event.attendee_count} going
        </p>
      </div>
      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Attendees</h2>
            <p className="text-xs text-muted-foreground">
              {event.attendee_count} people are going
            </p>
          </div>
          <SecondaryButton
            onClick={() => setShowAttendees((visible) => !visible)}
            className="min-h-10 rounded-xl px-3 text-xs"
          >
            {showAttendees ? "Hide attendees" : "View attendees"}
          </SecondaryButton>
        </div>
        {showAttendees && (
          <div className="mt-4 space-y-3">
            {attendeesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading attendees…
              </p>
            ) : attendeesQuery.data?.length ? (
              attendeesQuery.data.map((attendee) => {
                const name =
                  `${attendee.user.first_name} ${attendee.user.last_name}`.trim() ||
                  attendee.user.username;
                return (
                  <div key={attendee.id} className="flex items-center gap-3">
                    <AvatarPlaceholder
                      name={name}
                      imageUrl={attendee.user.avatar}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {attendee.status}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No attendees yet.</p>
            )}
          </div>
        )}
      </section>
      <div className="mt-7 grid grid-cols-2 gap-3">
        {event.attendance_status ? (
          <SecondaryButton
            onClick={() => leaveMutation.mutate()}
            disabled={leaveMutation.isPending}
            className="w-full"
          >
            Leave Event
          </SecondaryButton>
        ) : (
          <PrimaryButton
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="w-full"
          >
            Join Event
          </PrimaryButton>
        )}
        <SecondaryButton
          onClick={() => toast.info("Event sharing is coming soon.")}
          className="w-full"
        >
          <Share2 className="size-4" />
          Share Event
        </SecondaryButton>
      </div>
    </main>
  );
}
