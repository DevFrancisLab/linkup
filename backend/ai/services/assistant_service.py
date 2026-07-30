import re

from .groq_service import generate_chat_completion
from .prompt_service import build_messages, parse_assistant_response


def _normalise(value):
    return value.lower() if isinstance(value, str) else ""


def _attendee_text(attendee):
    return " ".join(
        [
            _normalise(attendee.get("profession")),
            _normalise(attendee.get("company")),
            " ".join(_normalise(interest) for interest in attendee.get("interests", [])),
            " ".join(
                _normalise(looking_for) for looking_for in attendee.get("looking_for", [])
            ),
        ]
    )


def _matching_attendees(context, terms):
    return [
        attendee
        for attendee in context["event_attendees"]
        if attendee["username"] != context["user"]["username"]
        and all(term in _attendee_text(attendee) for term in terms)
    ]


def _format_people(people):
    return "; ".join(
        f"{person['name']} — {person['profession'] or 'profile details are limited'}"
        for person in people
    )


def _no_event_response():
    return {
        "reply": "LinkUp does not have an active event with attendee data for you yet. Join or create an event first, then I can recommend people.",
        "suggestions": ["Find tomorrow's events", "Create an event"],
        "confidence": 1.0,
    }


def _no_matches_response(label, event_title):
    return {
        "reply": f"I could not find {label} among attendees for {event_title}. Try another event or update your profile preferences.",
        "suggestions": ["Who should I meet?", "Find tomorrow's events"],
        "confidence": 1.0,
    }


def _availability_data_response(label):
    return {
        "reply": f"LinkUp does not have attendee {label} data yet, so I cannot make a reliable recommendation.",
        "suggestions": ["Who should I meet?", "Find tomorrow's events"],
        "confidence": 1.0,
    }


def _recommend_people(context):
    attendees = [
        attendee
        for attendee in context["event_attendees"]
        if attendee["username"] != context["user"]["username"]
    ]
    if not attendees:
        return _no_matches_response("strong networking matches", context["selected_event"]["title"])

    user_terms = {
        _normalise(value)
        for value in (
            context["user"]["interests"] + context["user"]["looking_for"]
        )
        if _normalise(value)
    }
    ranked = sorted(
        attendees,
        key=lambda attendee: sum(term in _attendee_text(attendee) for term in user_terms),
        reverse=True,
    )[:3]
    if not user_terms or not any(
        sum(term in _attendee_text(attendee) for term in user_terms)
        for attendee in ranked
    ):
        return _no_matches_response("strong networking matches", context["selected_event"]["title"])

    return {
        "reply": f"Start with {_format_people(ranked)}.",
        "suggestions": ["Find AI founders", "Find investors"],
        "confidence": 0.9,
    }


def _supported_response(context, message):
    query = _normalise(message)
    if any(term in query for term in ("coffee", "lunch")):
        return _availability_data_response("coffee or lunch availability")
    if "westlands" in query or "travelling" in query or "traveling" in query:
        return _availability_data_response("travel destination")
    if not context["selected_event"]:
        return _no_event_response()

    event_title = context["selected_event"]["title"]
    if "ai founder" in query or ("ai" in query and "founder" in query):
        matches = _matching_attendees(context, ["ai", "founder"])
        return (
            {
                "reply": f"AI founders at {event_title}: {_format_people(matches[:3])}.",
                "suggestions": ["Who should I meet?", "Find investors"],
                "confidence": 1.0,
            }
            if matches
            else _no_matches_response("AI founders", event_title)
        )
    if "frontend" in query or "front-end" in query or "front end" in query:
        matches = _matching_attendees(context, ["frontend"])
        return (
            {
                "reply": f"Frontend developers at {event_title}: {_format_people(matches[:3])}.",
                "suggestions": ["Who should I meet?", "Find AI founders"],
                "confidence": 1.0,
            }
            if matches
            else _no_matches_response("frontend developers", event_title)
        )
    if "co-founder" in query or "cofounder" in query or "co founder" in query:
        matches = _matching_attendees(context, ["founder"])
        return (
            {
                "reply": f"People interested in founder conversations at {event_title}: {_format_people(matches[:3])}.",
                "suggestions": ["Who should I meet?", "Find investors"],
                "confidence": 0.9,
            }
            if matches
            else _no_matches_response("people looking for co-founders", event_title)
        )
    if "investor" in query:
        matches = _matching_attendees(context, ["investor"])
        return (
            {
                "reply": f"Investors at {event_title}: {_format_people(matches[:3])}.",
                "suggestions": ["Who should I meet?", "Find AI founders"],
                "confidence": 1.0,
            }
            if matches
            else _no_matches_response("investors", event_title)
        )
    if re.search(r"who should i meet|recommend.*(?:people|connect)|connect with", query):
        return _recommend_people(context)
    return None


def respond_to_assistant_request(context, history, message):
    """Use verified LinkUp data first, then ask Groq for unsupported requests."""
    response = _supported_response(context, message)
    if response is not None:
        return response
    content = generate_chat_completion(build_messages(context, history, message))
    return parse_assistant_response(content)
