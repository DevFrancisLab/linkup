import logging

import africastalking
from django.conf import settings

from .utils import mask_phone_number, normalize_kenyan_phone_number

logger = logging.getLogger(__name__)


class SMSProviderError(Exception):
    """Raised when Africa's Talking cannot accept an SMS request."""


def _get_credentials():
    username = settings.AT_USERNAME.strip()
    api_key = settings.AT_API_KEY.strip()
    sender_id = settings.AT_SENDER_ID.strip()
    if not username or not api_key:
        logger.error("Africa's Talking credentials are not configured.")
        raise SMSProviderError("SMS service is not configured.")
    return username, api_key, sender_id


def send_sms(phone_number, message):
    """Send a text message through Africa's Talking and return its response."""
    recipient = normalize_kenyan_phone_number(phone_number)
    message = message.strip()
    if not message:
        raise ValueError("Message cannot be empty.")

    username, api_key, sender_id = _get_credentials()
    try:
        africastalking.initialize(username, api_key)
        options = {"sender_id": sender_id} if sender_id else {}
        response = africastalking.SMS.send(message, [recipient], **options)
    except Exception as error:
        logger.exception(
            "Africa's Talking SMS request failed for recipient %s.",
            mask_phone_number(recipient),
        )
        raise SMSProviderError("SMS provider could not send the message.") from error

    logger.info("Africa's Talking accepted an SMS for recipient %s.", mask_phone_number(recipient))
    return response
