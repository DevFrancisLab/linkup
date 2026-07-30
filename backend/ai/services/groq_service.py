import logging

from django.conf import settings
from groq import APIConnectionError, APIStatusError, Groq

logger = logging.getLogger(__name__)


class AIProviderError(Exception):
    """Raised when the configured AI provider cannot complete a request."""


def generate_chat_completion(messages):
    """Send prepared chat messages to Groq and return the response content."""
    if not settings.GROQ_API_KEY:
        logger.error("Groq API key is not configured.")
        raise AIProviderError("AI service is not configured.")

    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        content = completion.choices[0].message.content
    except (APIConnectionError, APIStatusError, IndexError, TypeError) as error:
        logger.exception("Groq chat completion failed.")
        raise AIProviderError("AI service is temporarily unavailable.") from error

    if not content:
        logger.error("Groq returned an empty chat completion.")
        raise AIProviderError("AI service returned an empty response.")
    return content
