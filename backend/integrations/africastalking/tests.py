from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import override_settings
from django.urls import resolve
from rest_framework import status
from rest_framework.test import APITestCase

from .sms import send_sms
from .ussd import UssdRequest, handle_ussd_request
from .utils import normalize_kenyan_phone_number
from .views import SendSMSView

User = get_user_model()


class KenyanPhoneNumberTests(APITestCase):
    def test_normalizes_supported_kenyan_mobile_formats(self):
        self.assertEqual(normalize_kenyan_phone_number("0712 345 678"), "+254712345678")
        self.assertEqual(normalize_kenyan_phone_number("254712345678"), "+254712345678")
        self.assertEqual(normalize_kenyan_phone_number("+254112345678"), "+254112345678")

    def test_rejects_invalid_phone_number(self):
        with self.assertRaises(ValueError):
            normalize_kenyan_phone_number("12345")


class SMSAdapterTests(APITestCase):
    @override_settings(
        AT_USERNAME="sandbox",
        AT_API_KEY="api-key",
        AT_SENDER_ID="LinkUp",
    )
    @patch("integrations.africastalking.sms.africastalking")
    def test_sends_normalized_number_with_sender_id(self, africastalking_mock):
        send_sms("0712 345 678", "Hello from LinkUp")

        africastalking_mock.initialize.assert_called_once_with("sandbox", "api-key")
        africastalking_mock.SMS.send.assert_called_once_with(
            "Hello from LinkUp",
            ["+254712345678"],
            sender_id="LinkUp",
        )


class SendSMSTests(APITestCase):
    url = "/api/integrations/sms/send/"

    def setUp(self):
        self.throttle_classes = SendSMSView.throttle_classes
        SendSMSView.throttle_classes = []
        self.user = User.objects.create_user(username="sms-user", password="secure-password-123")

    def tearDown(self):
        SendSMSView.throttle_classes = self.throttle_classes

    def test_requires_authentication(self):
        response = self.client.post(self.url, {"phone": "0712345678", "message": "Hello"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("integrations.africastalking.views.send_sms")
    def test_sends_valid_sms(self, send_sms_mock):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.url,
            {"phone": "0712345678", "message": "LinkUp event reminder"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        send_sms_mock.assert_called_once_with(
            phone="0712345678",
            message="LinkUp event reminder",
        )

    def test_rejects_empty_message(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.url,
            {"phone": "0712345678", "message": "   "},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(AT_USSD_SERVICE_CODE="*384*45324#")
class UssdTests(APITestCase):
    url = "/ussd"

    def post(self, text):
        return self.client.post(
            self.url,
            {
                "sessionId": "session-123",
                "serviceCode": "*384*45324#",
                "phoneNumber": "+254712345678",
                "text": text,
            },
        )

    def test_initial_request_returns_main_menu(self):
        response = self.post("")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/plain; charset=utf-8")
        self.assertContains(response, "CON Welcome to LinkUp", status_code=200)
        self.assertContains(response, "1. Upcoming Events", status_code=200)

    def test_selection_returns_terminal_response(self):
        response = self.post("1")
        self.assertEqual(response.content.decode(), "END Upcoming events will be available here soon.")

    def test_invalid_selection_returns_menu(self):
        response = self.post("9")
        self.assertTrue(response.content.decode().startswith("CON Invalid selection."))

    def test_callback_has_no_trailing_slash(self):
        response = self.client.post("/ussd/", {})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_callback_route_resolves_to_ussd_view(self):
        self.assertEqual(resolve("/ussd").view_name, "africastalking-ussd")

    def test_rejects_an_unrecognized_service_code(self):
        response = self.client.post(
            self.url,
            {"serviceCode": "*123#", "text": ""},
        )
        self.assertEqual(response.content.decode(), "END Invalid service code.")

    def test_request_handler_uses_first_menu_selection(self):
        response = handle_ussd_request(
            UssdRequest("session-123", "*123#", "+254712345678", "5*anything")
        )
        self.assertEqual(response, "END Thanks for using LinkUp.")
