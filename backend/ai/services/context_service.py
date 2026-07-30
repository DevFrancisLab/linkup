from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from accounts.models import UserProfile
from events.models import Event, EventAttendee


def _visible_events(user):
    return Event.objects.filter(
        Q(visibility=Event.Visibility.PUBLIC)
        | Q(organizer=user)
        | Q(attendances__user=user)
    ).distinct()


def _serialize_event(event):
    return {
        "id": event.id,
        "title": event.title,
        "category": event.category,
        "venue": event.venue,
        "city": event.city,
        "country": event.country,
        "start_datetime": event.start_datetime.isoformat(),
        "description": event.description[:500],
    }


def _serialize_attendee(attendance):
    profile = getattr(attendance.user, "userprofile", None)
    return {
        "username": attendance.user.username,
        "name": attendance.user.get_full_name() or attendance.user.username,
        "profession": profile.profession if profile else "",
        "company": profile.company if profile else "",
        "interests": profile.interests[:10] if profile else [],
        "looking_for": profile.looking_for[:10] if profile else [],
        "status": attendance.status,
    }


def build_assistant_context(user, event_id=None):
    """Build the minimum authorized LinkUp context for an AI request."""
    profile, _ = UserProfile.objects.get_or_create(user=user)
    events = _visible_events(user)
    current_events = events.filter(
        Q(attendances__user=user) | Q(organizer=user),
        end_datetime__gte=timezone.now(),
    ).order_by("start_datetime")
    selected_event = (
        get_object_or_404(events, pk=event_id)
        if event_id is not None
        else current_events.first()
    )
    upcoming_events = events.filter(end_datetime__gte=timezone.now()).order_by(
        "start_datetime"
    )[:5]

    attendees = []
    if selected_event:
        attendances = (
            EventAttendee.objects.filter(event=selected_event)
            .select_related("user", "user__userprofile")
            .order_by("-joined_at")[:20]
        )
        attendees = [_serialize_attendee(attendance) for attendance in attendances]

    return {
        "user": {
            "first_name": user.first_name,
            "username": user.username,
            "profession": profile.profession,
            "company": profile.company,
            "bio": profile.bio[:500],
            "interests": profile.interests[:10],
            "looking_for": profile.looking_for[:10],
        },
        "selected_event": _serialize_event(selected_event) if selected_event else None,
        "event_attendees": attendees,
        "upcoming_events": [_serialize_event(event) for event in upcoming_events],
    }
