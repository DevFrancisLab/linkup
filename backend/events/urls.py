from django.urls import path

from .views import (
    EventAttendeeListView,
    EventDetailView,
    EventListCreateView,
    JoinEventView,
    LeaveEventView,
)

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("<int:pk>/join/", JoinEventView.as_view(), name="event-join"),
    path("<int:pk>/leave/", LeaveEventView.as_view(), name="event-leave"),
    path(
        "<int:pk>/attendees/",
        EventAttendeeListView.as_view(),
        name="event-attendees",
    ),
]
