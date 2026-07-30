from django.db import transaction
from django.db.models import Count, Prefetch, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event, EventAttendee
from .serializers import EventAttendanceSerializer, EventSerializer, JoinEventSerializer


def event_queryset_for(user):
    viewer_attendances = EventAttendee.objects.filter(user=user)
    return (
        Event.objects.filter(
            Q(visibility=Event.Visibility.PUBLIC)
            | Q(organizer=user)
            | Q(attendances__user=user)
        )
        .select_related("organizer")
        .prefetch_related(
            Prefetch(
                "attendances",
                queryset=viewer_attendances,
                to_attr="viewer_attendances",
            )
        )
        .annotate(
            attendee_count=Count(
                "attendances",
                filter=Q(attendances__status=EventAttendee.Status.GOING),
                distinct=True,
            )
        )
        .distinct()
    )


class EventListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = event_queryset_for(self.request.user)
        category = self.request.query_params.get("category")
        city = self.request.query_params.get("city")
        search = self.request.query_params.get("q")
        scope = self.request.query_params.get("scope")

        if category:
            queryset = queryset.filter(category__iexact=category)
        if city:
            queryset = queryset.filter(city__iexact=city)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(venue__icontains=search)
            )
        if scope == "created":
            queryset = queryset.filter(organizer=self.request.user)
        elif scope == "joined":
            queryset = queryset.filter(attendances__user=self.request.user)
        elif scope == "past":
            queryset = queryset.filter(end_datetime__lt=timezone.now())
        elif scope == "upcoming":
            queryset = queryset.filter(end_datetime__gte=timezone.now())
        return queryset

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({"events": serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"event": serializer.data}, status=status.HTTP_201_CREATED)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        return event_queryset_for(self.request.user)

    def _ensure_organizer(self, event):
        if event.organizer_id != self.request.user.id:
            raise PermissionDenied("Only the event organizer can modify this event.")

    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        return Response({"event": self.get_serializer(event).data})

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        self._ensure_organizer(event)
        serializer = self.get_serializer(
            event,
            data=request.data,
            partial=kwargs.pop("partial", False),
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"event": serializer.data})

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        self._ensure_organizer(event)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class JoinEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = JoinEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            event = get_object_or_404(Event.objects.select_for_update(), pk=pk)
            if (
                event.visibility == Event.Visibility.PRIVATE
                and event.organizer_id != request.user.id
            ):
                raise PermissionDenied("This is a private event.")
            if (
                event.registration_deadline
                and event.registration_deadline < timezone.now()
            ):
                raise ValidationError({"detail": "Registration for this event has closed."})

            attendance, created = EventAttendee.objects.get_or_create(
                event=event,
                user=request.user,
                defaults={"status": serializer.validated_data["status"]},
            )
            requested_status = serializer.validated_data["status"]
            if not created and attendance.status != requested_status:
                attendance.status = requested_status
                attendance.save(update_fields=["status"])

            going_count = EventAttendee.objects.filter(
                event=event,
                status=EventAttendee.Status.GOING,
            ).count()
            if (
                attendance.status == EventAttendee.Status.GOING
                and event.max_attendees is not None
                and going_count > event.max_attendees
            ):
                if created:
                    attendance.delete()
                else:
                    attendance.status = EventAttendee.Status.INTERESTED
                    attendance.save(update_fields=["status"])
                raise ValidationError({"detail": "This event has reached capacity."})

        event = event_queryset_for(request.user).get(pk=event.pk)
        return Response(
            {
                "attendance": EventAttendanceSerializer(attendance).data,
                "event": EventSerializer(event, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class LeaveEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        event = get_object_or_404(event_queryset_for(request.user), pk=pk)
        attendance = EventAttendee.objects.filter(
            event=event,
            user=request.user,
        ).first()
        if attendance is None:
            raise ValidationError({"detail": "You have not joined this event."})
        attendance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EventAttendeeListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventAttendanceSerializer

    def get_queryset(self):
        event = get_object_or_404(
            event_queryset_for(self.request.user),
            pk=self.kwargs["pk"],
        )
        return EventAttendee.objects.filter(event=event).select_related("user")

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({"attendees": serializer.data})
