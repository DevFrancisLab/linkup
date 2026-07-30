from PIL import Image, UnidentifiedImageError
from rest_framework import serializers

from .models import Event, EventAttendee

MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_COVER_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


class OrganizerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, user):
        profile = getattr(user, "userprofile", None)
        if not profile or not profile.avatar:
            return None
        request = self.context.get("request")
        url = profile.avatar.url
        return request.build_absolute_uri(url) if request else url


class EventSerializer(serializers.ModelSerializer):
    organizer = OrganizerSerializer(read_only=True)
    attendee_count = serializers.SerializerMethodField()
    attendance_status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            "id", "title", "description", "cover_image", "organizer", "venue", "city",
            "country", "latitude", "longitude", "start_datetime", "end_datetime", "category",
            "visibility", "max_attendees", "registration_deadline", "attendee_count",
            "attendance_status", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "organizer", "attendee_count", "attendance_status", "created_at", "updated_at",
        )

    def get_attendee_count(self, event):
        return getattr(
            event,
            "attendee_count",
            event.attendances.filter(status=EventAttendee.Status.GOING).count(),
        )

    def get_attendance_status(self, event):
        attendances = getattr(event, "viewer_attendances", None)
        if attendances is not None:
            return attendances[0].status if attendances else None
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        attendance = event.attendances.filter(user=request.user).first()
        return attendance.status if attendance else None

    def validate_cover_image(self, value):
        if value is None:
            return value
        if value.size > MAX_COVER_IMAGE_SIZE:
            raise serializers.ValidationError("Cover image must be 5 MB or smaller.")
        if value.content_type not in ALLOWED_COVER_IMAGE_TYPES:
            raise serializers.ValidationError("Use a JPEG, PNG, or WebP image.")
        try:
            Image.open(value).verify()
        except (UnidentifiedImageError, OSError) as error:
            raise serializers.ValidationError("Upload a valid image file.") from error
        finally:
            value.seek(0)
        return value

    def validate(self, attrs):
        start_datetime = attrs.get("start_datetime", getattr(self.instance, "start_datetime", None))
        end_datetime = attrs.get("end_datetime", getattr(self.instance, "end_datetime", None))
        registration_deadline = attrs.get(
            "registration_deadline", getattr(self.instance, "registration_deadline", None)
        )
        if start_datetime and end_datetime and end_datetime <= start_datetime:
            raise serializers.ValidationError({"end_datetime": "End time must be after start time."})
        if registration_deadline and start_datetime and registration_deadline > start_datetime:
            raise serializers.ValidationError(
                {"registration_deadline": "Registration must close before the event starts."}
            )
        return attrs


class EventAttendanceSerializer(serializers.ModelSerializer):
    user = OrganizerSerializer(read_only=True)

    class Meta:
        model = EventAttendee
        fields = ("id", "user", "joined_at", "status")
        read_only_fields = ("id", "user", "joined_at")


class JoinEventSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=EventAttendee.Status.choices,
        default=EventAttendee.Status.GOING,
        required=False,
    )
