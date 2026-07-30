import json

from ai.prompts.system_prompt import SYSTEM_PROMPT


class AIResponseFormatError(Exception):
    """Raised when an AI provider response does not match LinkUp's contract."""


def build_messages(context, history, message):
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"LinkUp context: {json.dumps(context, ensure_ascii=False)}",
        },
        *history,
        {"role": "user", "content": message},
    ]


def parse_assistant_response(content):
    try:
        payload = json.loads(content)
        reply = payload["reply"].strip()
    except (json.JSONDecodeError, KeyError, AttributeError, TypeError) as error:
        raise AIResponseFormatError("AI service returned an invalid response.") from error

    if not reply:
        raise AIResponseFormatError("AI service returned an invalid response.")

    suggestions = payload.get("suggestions", [])
    if not isinstance(suggestions, list):
        suggestions = []
    suggestions = [suggestion for suggestion in suggestions if isinstance(suggestion, str)][
        :3
    ]
    try:
        confidence = float(payload.get("confidence", 0.5))
    except (TypeError, ValueError):
        confidence = 0.5

    return {
        "reply": reply,
        "suggestions": suggestions,
        "confidence": max(0.0, min(1.0, confidence)),
    }
