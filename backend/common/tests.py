from unittest.mock import patch

from django.test import SimpleTestCase

from common.services.sms import (
    connection_request_message,
    event_reminder_message,
    networking_reminder_message,
    ride_share_match_message,
    send_sms,
    welcome_message,
)


class SMSServiceTests(SimpleTestCase):
    @patch("common.services.sms.send_via_provider")
    def test_delegates_sms_delivery_to_the_configured_provider(self, send_via_provider):
        send_sms("0712345678", "Hello from LinkUp")

        send_via_provider.assert_called_once_with("0712345678", "Hello from LinkUp")

    def test_message_builders_create_linkup_messages(self):
        self.assertIn("Ada", welcome_message("Ada"))
        self.assertIn("Builder Meetup", event_reminder_message("Builder Meetup", "tomorrow"))
        self.assertIn("Ada", connection_request_message("Ada"))
        self.assertIn("Builder Meetup", networking_reminder_message("Builder Meetup"))
        self.assertIn("Builder Meetup", ride_share_match_message("Builder Meetup"))
