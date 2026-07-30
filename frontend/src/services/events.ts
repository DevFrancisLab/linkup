import api from "./api";

export type AttendanceStatus = "going" | "interested";
export type EventVisibility = "public" | "private";

export interface EventOrganizer {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface LinkUpEvent {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  organizer: EventOrganizer;
  venue: string;
  city: string;
  country: string;
  latitude: string | null;
  longitude: string | null;
  start_datetime: string;
  end_datetime: string;
  category: string;
  visibility: EventVisibility;
  max_attendees: number | null;
  registration_deadline: string | null;
  attendee_count: number;
  attendance_status: AttendanceStatus | null;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: number;
  user: EventOrganizer;
  joined_at: string;
  status: AttendanceStatus;
}

export interface EventPayload {
  title: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  start_datetime: string;
  end_datetime: string;
  category: string;
  visibility: EventVisibility;
  max_attendees?: number | null;
  registration_deadline?: string | null;
  cover_image?: File | null;
}

interface EventListResponse {
  events: LinkUpEvent[];
}

interface EventResponse {
  event: LinkUpEvent;
}

interface AttendeeListResponse {
  attendees: EventAttendee[];
}

const asFormData = (payload: EventPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || key === "cover_image") return;
    formData.set(key, String(value));
  });
  if (payload.cover_image) formData.set("cover_image", payload.cover_image);
  return formData;
};

export const eventsService = {
  async list(params?: Record<string, string>) {
    const response = await api.get<EventListResponse>("/events/", { params });
    return response.data.events;
  },

  async get(eventId: number) {
    const response = await api.get<EventResponse>(`/events/${eventId}/`);
    return response.data.event;
  },

  async create(payload: EventPayload) {
    const response = await api.post<EventResponse>(
      "/events/",
      asFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data.event;
  },

  async update(eventId: number, payload: Partial<EventPayload>) {
    const response = await api.put<EventResponse>(
      `/events/${eventId}/`,
      asFormData(payload as EventPayload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.event;
  },

  async remove(eventId: number) {
    await api.delete(`/events/${eventId}/`);
  },

  async join(eventId: number, status: AttendanceStatus = "going") {
    const response = await api.post<
      EventResponse & { attendance: EventAttendee }
    >(`/events/${eventId}/join/`, { status });
    return response.data.event;
  },

  async leave(eventId: number) {
    await api.post(`/events/${eventId}/leave/`);
  },

  async attendees(eventId: number) {
    const response = await api.get<AttendeeListResponse>(
      `/events/${eventId}/attendees/`,
    );
    return response.data.attendees;
  },
};
