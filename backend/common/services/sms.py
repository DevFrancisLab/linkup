"""Provider-agnostic SMS services for LinkUp application modules."""

from integrations.africastalking.sms import send_sms as send_via_provider


def send_sms(phone, message):
    """Send an SMS without exposing provider-specific implementation details."""
    return send_via_provider(phone, message)


def welcome_message(first_name):
    return f"Welcome to LinkUp, {first_name}! Meet the right people at every event."


def event_reminder_message(event_title, start_time):
    return f"LinkUp reminder: {event_title} starts {start_time}. See you there!"


def connection_request_message(sender_name):
    return f"{sender_name} wants to connect with you on LinkUp."


def networking_reminder_message(event_title):
    return f"LinkUp: Keep networking at {event_title} and meet your next great connection."


def ride_share_match_message(event_title):
    return f"LinkUp found a potential ride-share match for {event_title}."
