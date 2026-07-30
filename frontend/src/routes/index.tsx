import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrors } from "@/services/auth";
import {
  eventsService,
  type EventPayload,
  type LinkUpEvent,
} from "@/services/events";

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

const DEMO_EVENTS = [
  {
    id: "product-safari",
    title: "Product Safari: The AI Edition",
    location: "The Alchemist, Westlands",
    date: "Thu, 15 Aug",
    time: "6:00 PM – 9:00 PM",
    attendees: 128,
    source: "LinkUp",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "design-systems",
    title: "Design Systems Nairobi",
    location: "Nairobi Garage, Kilimani",
    date: "Sat, 24 Aug",
    time: "10:00 AM",
    attendees: 76,
    source: "Luma",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "founder-fridays",
    title: "Founder Fridays: Build in Public",
    location: "Ikigai, Lower Kabete",
    date: "Fri, 30 Aug",
    time: "5:30 PM",
    attendees: 54,
    source: "Meetup",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  },
];

type EventFormValues = Omit<
  EventPayload,
  "max_attendees" | "registration_deadline" | "start_datetime" | "end_datetime"
> & {
  event_date: string;
  start_time: string;
  end_time: string;
  max_attendees: string;
  registration_deadline: string;
};

const emptyForm = (): EventFormValues => ({
  title: "",
  description: "",
  venue: "",
  city: "Nairobi",
  country: "Kenya",
  event_date: "",
  start_time: "",
  end_time: "",
  category: "Technology",
  visibility: "public",
  max_attendees: "",
  registration_deadline: "",
  cover_image: undefined,
});

const toFormValues = (event: LinkUpEvent): EventFormValues => ({
  title: event.title,
  description: event.description,
  venue: event.venue,
  city: event.city,
  country: event.country,
  event_date: event.start_datetime.slice(0, 10),
  start_time: event.start_datetime.slice(11, 16),
  end_time: event.end_datetime.slice(11, 16),
  category: event.category,
  visibility: event.visibility,
  max_attendees: event.max_attendees?.toString() ?? "",
  registration_deadline: event.registration_deadline
    ? new Date(event.registration_deadline).toISOString().slice(0, 16)
    : "",
  cover_image: undefined,
});

const toPayload = (values: EventFormValues): EventPayload => ({
  ...values,
  start_datetime: new Date(
    `${values.event_date}T${values.start_time}`,
  ).toISOString(),
  end_datetime: new Date(
    `${values.event_date}T${values.end_time}`,
  ).toISOString(),
  max_attendees: values.max_attendees ? Number(values.max_attendees) : null,
  registration_deadline: values.registration_deadline
    ? new Date(values.registration_deadline).toISOString()
    : null,
});

function EventsPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-36">
        <header className="flex min-h-22 items-center justify-between px-5 pb-3 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              LinkUp
            </p>
            <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
              Events
            </h1>
          </div>
        </header>

        <main className="space-y-8 px-5">
          <MyEventsSection onCreate={() => setIsFormOpen(true)} />
          <SuggestedEvents />
        </main>
      </div>
      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-25 right-5 z-10 inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 font-display text-sm font-bold text-primary-foreground shadow-[var(--shadow-raised)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Plus className="size-5" />
        Create Event
      </button>
      <EventFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
      <BottomNavigation
        activeId="events"
        onChange={(id) => {
          if (id === "home") void navigate({ to: "/home" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "connections") void navigate({ to: "/connections" });
          if (id === "profile") void navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}

function MyEventsSection({ onCreate }: { onCreate: () => void }) {
  const [selectedEventId, setSelectedEventId] = useState<number>();
  const createdEvents = useQuery({
    queryKey: ["events", "created"],
    queryFn: () => eventsService.list({ scope: "created" }),
  });
  const joinedEvents = useQuery({
    queryKey: ["events", "joined"],
    queryFn: () => eventsService.list({ scope: "joined" }),
  });
  const events = useMemo(
    () =>
      Array.from(
        new Map(
          [...(createdEvents.data ?? []), ...(joinedEvents.data ?? [])].map(
            (event) => [event.id, event],
          ),
        ).values(),
      ),
    [createdEvents.data, joinedEvents.data],
  );

  return (
    <section aria-labelledby="my-events-title">
      <div className="mb-3.5 flex items-center justify-between px-1">
        <div>
          <h2
            id="my-events-title"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            My Events
          </h2>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            Events you create or join on LinkUp.
          </p>
        </div>
        <span className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary">
          {events.length}
        </span>
      </div>
      {createdEvents.isLoading || joinedEvents.isLoading ? (
        <div className="surface-card rounded-[1.45rem] border border-border/70 px-5 py-8 text-center text-sm text-muted-foreground">
          Loading your events…
        </div>
      ) : events.length ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <RealEventCard
              key={event.id}
              event={event}
              onOpen={() => setSelectedEventId(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-[1.45rem] border border-dashed border-border px-6 py-8 text-center">
          <CalendarDays className="mx-auto size-8 text-primary/55" />
          <p className="mt-3 font-display font-semibold">
            No LinkUp events yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one or join an event to see it here.
          </p>
          <SecondaryButton onClick={onCreate} className="mt-3">
            Create your first event
          </SecondaryButton>
        </div>
      )}
      <EventDetailDialog
        eventId={selectedEventId}
        onOpenChange={(open) => {
          if (!open) setSelectedEventId(undefined);
        }}
      />
    </section>
  );
}

function RealEventCard({
  event,
  onOpen,
}: {
  event: LinkUpEvent;
  onOpen: () => void;
}) {
  const start = new Date(event.start_datetime);

  return (
    <article className="surface-card overflow-hidden rounded-[1.45rem] border border-border/70">
      {event.cover_image && (
        <img
          src={event.cover_image}
          alt=""
          className="h-36 w-full object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-foreground">
              {event.title}
            </h3>
            <p className="mt-1 text-xs font-semibold text-primary">
              {event.category}
            </p>
          </div>
          {event.attendance_status && (
            <span className="rounded-full bg-success/12 px-2 py-1 text-[10px] font-bold text-success">
              {event.attendance_status}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1.5 text-xs font-medium text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-primary" />
            {start.toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Clock3 className="size-3.5 text-primary" />
            {start.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5 text-primary" />
            {event.venue}, {event.city}
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-3.5 text-primary" />
            {event.attendee_count} going
          </p>
        </div>
        <SecondaryButton
          onClick={onOpen}
          className="mt-3 min-h-10 w-full rounded-xl bg-primary/7 text-xs"
        >
          View details
        </SecondaryButton>
      </div>
    </article>
  );
}

function SuggestedEvents() {
  return (
    <section aria-labelledby="suggested-events-title">
      <div className="mb-3.5 px-1">
        <h2
          id="suggested-events-title"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          Suggested Events
        </h2>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
          Sample events to explore while your LinkUp network grows.
        </p>
      </div>
      <div className="grid gap-4">
        {DEMO_EVENTS.map((event) => (
          <article
            key={event.id}
            className="surface-card overflow-hidden rounded-[1.45rem] border border-border/70 opacity-90"
          >
            <img
              src={event.image}
              alt=""
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-bold text-primary">
                {event.source}
              </span>
              <h3 className="mt-3 font-display text-base font-semibold tracking-tight">
                {event.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {event.date} · {event.time}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {event.location} · {event.attendees} attendees
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventFormDialog({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: LinkUpEvent;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [values, setValues] = useState<EventFormValues>(emptyForm);
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>();

  useEffect(() => {
    setValues(event ? toFormValues(event) : emptyForm());
    setCoverPreview(event?.cover_image ?? undefined);
  }, [event, open]);

  const mutation = useMutation({
    mutationFn: (payload: EventPayload) =>
      event
        ? eventsService.update(event.id, payload)
        : eventsService.create(payload),
    onSuccess: (savedEvent) => {
      queryClient.setQueryData(["event", savedEvent.id], savedEvent);
      queryClient.setQueryData<LinkUpEvent[]>(
        ["events", "created"],
        (current) => [
          savedEvent,
          ...(current ?? []).filter(({ id }) => id !== savedEvent.id),
        ],
      );
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      onOpenChange(false);
      if (event) {
        toast.success("Event changes saved.");
      } else {
        toast.success("Event created successfully.");
        void navigate({
          to: "/events/$eventId",
          params: { eventId: String(savedEvent.id) },
        });
      }
    },
  });

  const submit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setError("");
    const requiredFields = [
      values.title,
      values.description,
      values.venue,
      values.city,
      values.country,
      values.event_date,
      values.start_time,
      values.end_time,
      values.category,
    ];
    if (requiredFields.some((value) => !value.trim())) {
      setError("Complete all required event details.");
      return;
    }
    const start = new Date(`${values.event_date}T${values.start_time}`);
    const end = new Date(`${values.event_date}T${values.end_time}`);
    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }
    if (
      values.registration_deadline &&
      new Date(values.registration_deadline) > start
    ) {
      setError("Registration must close before the event starts.");
      return;
    }
    if (values.max_attendees && Number(values.max_attendees) <= 0) {
      setError("Maximum attendees must be greater than zero.");
      return;
    }
    mutation.mutate(toPayload(values), {
      onError: (requestError) => {
        const errors = getApiErrors(requestError);
        setError(
          errors.detail ??
            errors.non_field_errors ??
            "Unable to save this event.",
        );
      },
    });
  };

  const update = <Key extends keyof EventFormValues>(
    key: Key,
    value: EventFormValues[Key],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const updateCoverImage = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPEG, PNG, or WebP cover image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be 5 MB or smaller.");
      return;
    }
    setError("");
    update("cover_image", file);
    setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto rounded-3xl border-border/70 p-5">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            Publish a real event to your LinkUp network.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <EventInput
            label="Title"
            value={values.title}
            onChange={(value) => update("title", value)}
            required
          />
          <EventInput
            label="Description"
            value={values.description}
            onChange={(value) => update("description", value)}
            textarea
            required
          />
          <EventInput
            label="Venue"
            value={values.venue}
            onChange={(value) => update("venue", value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <EventInput
              label="City"
              value={values.city}
              onChange={(value) => update("city", value)}
              required
            />
            <EventInput
              label="Country"
              value={values.country}
              onChange={(value) => update("country", value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <EventInput
              label="Date"
              type="date"
              value={values.event_date}
              onChange={(value) => update("event_date", value)}
              required
            />
            <EventInput
              label="Start time"
              type="time"
              value={values.start_time}
              onChange={(value) => update("start_time", value)}
              required
            />
          </div>
          <EventInput
            label="End time"
            type="time"
            value={values.end_time}
            onChange={(value) => update("end_time", value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <EventInput
              label="Category"
              value={values.category}
              onChange={(value) => update("category", value)}
              required
            />
            <EventInput
              label="Capacity"
              type="number"
              value={values.max_attendees}
              onChange={(value) => update("max_attendees", value)}
            />
          </div>
          <EventInput
            label="Registration deadline"
            type="datetime-local"
            value={values.registration_deadline}
            onChange={(value) => update("registration_deadline", value)}
          />
          <label className="block text-sm font-semibold">
            Cover image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(inputEvent) =>
                updateCoverImage(inputEvent.target.files?.[0])
              }
              className="mt-2 block w-full text-xs text-muted-foreground"
            />
          </label>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Selected event cover preview"
              className="h-36 w-full rounded-2xl object-cover"
            />
          )}
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={values.visibility === "private"}
              onChange={(inputEvent) =>
                update(
                  "visibility",
                  inputEvent.target.checked ? "private" : "public",
                )
              }
            />
            Private event
          </label>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <PrimaryButton
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending
              ? "Saving…"
              : event
                ? "Save changes"
                : "Create Event"}
          </PrimaryButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EventInput({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={(inputEvent) => onChange(inputEvent.target.value)}
          required={required}
          rows={3}
          className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-normal"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(inputEvent) => onChange(inputEvent.target.value)}
          required={required}
          min={type === "number" ? "1" : undefined}
          className="mt-2 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-normal"
        />
      )}
    </label>
  );
}

function EventDetailDialog({
  eventId,
  onOpenChange,
}: {
  eventId?: number;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsService.get(eventId!),
    enabled: Boolean(eventId),
  });
  const attendeesQuery = useQuery({
    queryKey: ["event", eventId, "attendees"],
    queryFn: () => eventsService.attendees(eventId!),
    enabled: Boolean(eventId),
  });

  const syncEvent = (event: LinkUpEvent) => {
    queryClient.setQueryData(["event", event.id], event);
    queryClient.setQueryData<LinkUpEvent[]>(["events", "joined"], (current) => [
      event,
      ...(current ?? []).filter(({ id }) => id !== event.id),
    ]);
    void queryClient.invalidateQueries({ queryKey: ["events"] });
    void queryClient.invalidateQueries({
      queryKey: ["event", event.id, "attendees"],
    });
  };
  const joinMutation = useMutation({
    mutationFn: () => eventsService.join(eventId!),
    onSuccess: syncEvent,
  });
  const leaveMutation = useMutation({
    mutationFn: () => eventsService.leave(eventId!),
    onSuccess: () => {
      queryClient.setQueryData<LinkUpEvent[]>(["events", "joined"], (current) =>
        (current ?? []).filter(({ id }) => id !== eventId),
      );
      queryClient.setQueryData<LinkUpEvent | undefined>(
        ["event", eventId],
        (current) =>
          current
            ? {
                ...current,
                attendee_count: Math.max(0, current.attendee_count - 1),
                attendance_status: null,
              }
            : current,
      );
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      void queryClient.invalidateQueries({
        queryKey: ["event", eventId, "attendees"],
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => eventsService.remove(eventId!),
    onSuccess: () => {
      for (const scope of ["created", "joined"]) {
        queryClient.setQueryData<LinkUpEvent[]>(["events", scope], (current) =>
          (current ?? []).filter(({ id }) => id !== eventId),
        );
      }
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      onOpenChange(false);
    },
  });
  const event = eventQuery.data;
  const isOrganizer = event?.organizer.id === user?.id;

  return (
    <>
      <Dialog open={Boolean(eventId) && !editing} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto rounded-3xl border-border/70 p-5">
          {eventQuery.isLoading ? (
            <p>Loading event…</p>
          ) : (
            event && (
              <>
                <DialogHeader>
                  <DialogTitle>{event.title}</DialogTitle>
                  <DialogDescription>
                    {event.venue}, {event.city} ·{" "}
                    {new Date(event.start_datetime).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                {event.cover_image && (
                  <img
                    src={event.cover_image}
                    alt=""
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                )}
                <p className="text-sm leading-6 text-muted-foreground">
                  {event.description}
                </p>
                <p className="text-sm font-semibold">
                  {event.attendee_count} going
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Attendees</p>
                  {attendeesQuery.data?.map((attendee) => (
                    <p
                      key={attendee.id}
                      className="text-sm text-muted-foreground"
                    >
                      {attendee.user.first_name || attendee.user.username} ·{" "}
                      {attendee.status}
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {isOrganizer ? (
                    <>
                      <SecondaryButton onClick={() => setEditing(true)}>
                        <Pencil className="size-4" />
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </SecondaryButton>
                    </>
                  ) : event.attendance_status ? (
                    <SecondaryButton
                      onClick={() => leaveMutation.mutate()}
                      disabled={leaveMutation.isPending}
                      className="col-span-2"
                    >
                      Leave Event
                    </SecondaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() => joinMutation.mutate()}
                      disabled={joinMutation.isPending}
                      className="col-span-2"
                    >
                      Join Event
                    </PrimaryButton>
                  )}
                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
      <EventFormDialog open={editing} onOpenChange={setEditing} event={event} />
    </>
  );
}
