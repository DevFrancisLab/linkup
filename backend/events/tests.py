from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Event, EventAttendee

User = get_user_model()


class EventAPITests(APITestCase):
    list_url = "/api/events/"

    def setUp(self):
        self.organizer = User.objects.create_user(
            username="organizer",
            password="secure-password-123",
        )
        self.attendee = User.objects.create_user(
            username="attendee",
            password="secure-password-123",
        )
        self.other_user = User.objects.create_user(
            username="other-user",
            password="secure-password-123",
        )

    def event_payload(self):
        start = timezone.now() + timedelta(days=2)
        return {
            "title": "LinkUp Builders Meetup",
            "description": "Meet fellow builders.",
            "venue": "Nairobi Garage",
            "city": "Nairobi",
            "country": "Kenya",
            "latitude": "-1.292100",
            "longitude": "36.821900",
            "start_datetime": start.isoformat(),
            "end_datetime": (start + timedelta(hours=3)).isoformat(),
            "category": "Technology",
            "visibility": Event.Visibility.PUBLIC,
            "max_attendees": 2,
            "registration_deadline": (start - timedelta(hours=1)).isoformat(),
        }

    def create_event(self):
        return Event.objects.create(
            organizer=self.organizer,
            title="LinkUp Builders Meetup",
            description="Meet fellow builders.",
            venue="Nairobi Garage",
            city="Nairobi",
            country="Kenya",
            start_datetime=timezone.now() + timedelta(days=2),
            end_datetime=timezone.now() + timedelta(days=2, hours=3),
            category="Technology",
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_events_require_authentication(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_and_list_event(self):
        self.authenticate(self.organizer)
        create_response = self.client.post(self.list_url, self.event_payload(), format="json")

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data["event"]["organizer"]["username"], "organizer")

        list_response = self.client.get(self.list_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data["events"]), 1)

    def test_only_organizer_can_update_or_delete_event(self):
        event = self.create_event()
        self.authenticate(self.other_user)

        update_response = self.client.put(
            f"/api/events/{event.id}/",
            {**self.event_payload(), "title": "Changed"},
            format="json",
        )
        delete_response = self.client.delete(f"/api/events/{event.id}/")

        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_leave_and_list_attendees(self):
        event = self.create_event()
        self.authenticate(self.attendee)

        join_response = self.client.post(f"/api/events/{event.id}/join/", {}, format="json")
        self.assertEqual(join_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(join_response.data["event"]["attendee_count"], 1)
        self.assertEqual(join_response.data["attendance"]["status"], EventAttendee.Status.GOING)

        attendee_response = self.client.get(f"/api/events/{event.id}/attendees/")
        self.assertEqual(attendee_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(attendee_response.data["attendees"]), 1)

        leave_response = self.client.post(f"/api/events/{event.id}/leave/", {}, format="json")
        self.assertEqual(leave_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(EventAttendee.objects.filter(event=event, user=self.attendee).exists())

    def test_event_dates_are_validated(self):
        self.authenticate(self.organizer)
        payload = self.event_payload()
        payload["end_datetime"] = payload["start_datetime"]

        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("end_datetime", response.data)

    def test_unknown_event_actions_return_not_found(self):
        self.authenticate(self.attendee)

        join_response = self.client.post("/api/events/999/join/", {}, format="json")
        attendees_response = self.client.get("/api/events/999/attendees/")

        self.assertEqual(join_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(attendees_response.status_code, status.HTTP_404_NOT_FOUND)
