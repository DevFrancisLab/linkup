import json
from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from events.models import Event
from events.models import EventAttendee

from .services.assistant_service import respond_to_assistant_request
from .services.context_service import build_assistant_context
from .services.prompt_service import parse_assistant_response
from .views import ChatView

User = get_user_model()


class AIResponseTests(APITestCase):
    def test_normalizes_a_structured_provider_response(self):
        response = parse_assistant_response(
            json.dumps(
                {
                    "reply": "Try the AI meetup.",
                    "suggestions": ["Show event details"],
                    "confidence": 1.2,
                }
            )
        )
        self.assertEqual(response["reply"], "Try the AI meetup.")
        self.assertEqual(response["confidence"], 1.0)

    def test_context_includes_authorized_event_attendees(self):
        user = User.objects.create_user(username="context-user", password="secure-password-123")
        attendee = User.objects.create_user(username="attendee", password="secure-password-123")
        event = Event.objects.create(
            organizer=user,
            title="Builder Meetup",
            description="Meet builders.",
            venue="Nairobi Garage",
            city="Nairobi",
            country="Kenya",
            start_datetime=timezone.now() + timedelta(days=1),
            end_datetime=timezone.now() + timedelta(days=1, hours=2),
            category="Technology",
        )
        EventAttendee.objects.create(event=event, user=user)
        EventAttendee.objects.create(event=event, user=attendee)

        context = build_assistant_context(user, event.id)

        self.assertEqual(context["selected_event"]["id"], event.id)
        self.assertEqual(len(context["event_attendees"]), 2)
        self.assertNotIn("phone", context["event_attendees"][0])
        self.assertEqual(build_assistant_context(user)["selected_event"]["id"], event.id)

    def test_passes_real_attendee_context_to_groq(self):
        context = {
            "user": {"username": "sam", "interests": ["AI"], "looking_for": []},
            "selected_event": {"title": "Builder Meetup"},
            "event_attendees": [
                {
                    "username": "amina",
                    "name": "Amina Noor",
                    "profession": "AI Founder",
                    "company": "Nia Labs",
                    "interests": ["Generative AI"],
                    "looking_for": ["Collaborators"],
                    "status": "going",
                }
            ],
        }

        with patch("ai.services.assistant_service.generate_chat_completion") as groq_mock:
            groq_mock.return_value = json.dumps(
                {
                    "reply": "Meet Amina Noor from Nia Labs.",
                    "suggestions": ["Who else should I meet?"],
                    "confidence": 0.9,
                }
            )
            response = respond_to_assistant_request(context, [], "Find AI founders")

        self.assertIn("Amina Noor", response["reply"])
        groq_mock.assert_called_once()
        self.assertIn("Amina Noor", groq_mock.call_args.args[0][1]["content"])

    def test_uses_groq_when_application_data_is_missing(self):
        context = {
            "user": {"username": "sam", "interests": [], "looking_for": []},
            "selected_event": None,
            "event_attendees": [],
        }

        with patch("ai.services.assistant_service.generate_chat_completion") as groq_mock:
            groq_mock.return_value = json.dumps(
                {
                    "reply": "LinkUp does not have coffee availability data yet.",
                    "suggestions": [],
                    "confidence": 0.9,
                }
            )
            response = respond_to_assistant_request(context, [], "Who wants coffee?")

        self.assertIn("does not have coffee availability data", response["reply"])
        groq_mock.assert_called_once()

    def test_greeting_uses_groq(self):
        context = {
            "user": {"username": "sam", "first_name": "Sam", "interests": [], "looking_for": []},
            "selected_event": None,
            "event_attendees": [],
        }

        with patch("ai.services.assistant_service.generate_chat_completion") as groq_mock:
            groq_mock.return_value = json.dumps(
                {
                    "reply": "Hi Sam! How can I help today?",
                    "suggestions": [],
                    "confidence": 0.9,
                }
            )
            response = respond_to_assistant_request(context, [], "Hi!")

        self.assertIn("Hi Sam!", response["reply"])
        groq_mock.assert_called_once()

    def test_connections_question_uses_groq(self):
        context = {
            "user": {"username": "sam", "interests": [], "looking_for": []},
            "selected_event": None,
            "event_attendees": [],
        }

        with patch("ai.services.assistant_service.generate_chat_completion") as groq_mock:
            groq_mock.return_value = json.dumps(
                {
                    "reply": "LinkUp does not have saved connection data yet.",
                    "suggestions": [],
                    "confidence": 0.9,
                }
            )
            response = respond_to_assistant_request(context, [], "Who are we connected with?")

        self.assertIn("saved connection data", response["reply"])
        groq_mock.assert_called_once()


class ChatAPITests(APITestCase):
    url = "/api/ai/chat/"

    def setUp(self):
        cache.clear()
        self.throttle_classes = ChatView.throttle_classes
        ChatView.throttle_classes = []
        self.user = User.objects.create_user(username="ai-user", password="secure-password-123")
        self.event = Event.objects.create(
            organizer=self.user,
            title="AI Builders Nairobi",
            description="Meet builders.",
            venue="The Alchemist",
            city="Nairobi",
            country="Kenya",
            start_datetime=timezone.now() + timedelta(days=1),
            end_datetime=timezone.now() + timedelta(days=1, hours=2),
            category="Technology",
        )

    def tearDown(self):
        ChatView.throttle_classes = self.throttle_classes

    def test_requires_authentication(self):
        response = self.client.post(self.url, {"message": "Find events"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(GROQ_API_KEY="test-key", GROQ_MODEL="test-model")
    @patch("ai.services.assistant_service.generate_chat_completion")
    def test_returns_structured_chat_response(self, generate_chat_completion_mock):
        generate_chat_completion_mock.return_value = json.dumps(
            {
                "reply": "AI Builders Nairobi is tomorrow.",
                "suggestions": ["Open the event"],
                "confidence": 0.94,
            }
        )
        self.client.force_authenticate(self.user)

        response = self.client.post(
            self.url,
            {"message": "Find tomorrow's events", "event_id": self.event.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["confidence"], 0.94)
        self.assertIn("session_id", response.data)
        generate_chat_completion_mock.assert_called_once()

    @override_settings(GROQ_API_KEY="test-key", GROQ_MODEL="test-model")
    @patch("ai.services.assistant_service.generate_chat_completion")
    def test_reuses_only_current_session_history(self, generate_chat_completion_mock):
        generate_chat_completion_mock.side_effect = [
            json.dumps({"reply": "First answer", "suggestions": [], "confidence": 0.8}),
            json.dumps({"reply": "Second answer", "suggestions": [], "confidence": 0.8}),
        ]
        self.client.force_authenticate(self.user)
        first_response = self.client.post(
            self.url,
            {"message": "First question"},
            format="json",
        )
        self.client.post(
            self.url,
            {
                "message": "Second question",
                "session_id": first_response.data["session_id"],
            },
            format="json",
        )

        second_messages = generate_chat_completion_mock.call_args_list[1].args[0]
        self.assertIn({"role": "user", "content": "First question"}, second_messages)
        self.assertIn({"role": "assistant", "content": "First answer"}, second_messages)

    @override_settings(GROQ_API_KEY="test-key", GROQ_MODEL="test-model")
    @patch("ai.services.assistant_service.generate_chat_completion")
    def test_rejects_invalid_provider_response(self, generate_chat_completion_mock):
        generate_chat_completion_mock.return_value = "not json"
        self.client.force_authenticate(self.user)

        response = self.client.post(self.url, {"message": "Find events"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
