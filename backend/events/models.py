from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Event(models.Model):
    class Visibility(models.TextChoices):
        PUBLIC = "public", "Public"
        PRIVATE = "private", "Private"

    title = models.CharField(max_length=200)
    description = models.TextField()
    cover_image = models.ImageField(upload_to="event_covers/", blank=True, null=True)
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organized_events",
    )
    venue = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    category = models.CharField(max_length=100)
    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PUBLIC,
    )
    max_attendees = models.PositiveIntegerField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("start_datetime", "id")
        indexes = [
            models.Index(fields=("start_datetime",)),
            models.Index(fields=("city", "category")),
            models.Index(fields=("organizer", "start_datetime")),
        ]

    def clean(self):
        if self.end_datetime <= self.start_datetime:
            raise ValidationError({"end_datetime": "End time must be after start time."})
        if (
            self.registration_deadline
            and self.registration_deadline > self.start_datetime
        ):
            raise ValidationError(
                {"registration_deadline": "Registration must close before the event starts."}
            )

    def __str__(self):
        return self.title


class EventAttendee(models.Model):
    class Status(models.TextChoices):
        GOING = "going", "Going"
        INTERESTED = "interested", "Interested"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="attendances",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="event_attendances",
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.GOING,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=("event", "user"), name="unique_event_attendee")
        ]
        ordering = ("-joined_at",)

    def __str__(self):
        return f"{self.user.username} — {self.event.title}"
