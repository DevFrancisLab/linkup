from django.contrib import admin

from .models import Event, EventAttendee


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "organizer", "city", "start_datetime", "visibility")
    list_filter = ("visibility", "category", "city")
    search_fields = ("title", "venue", "city", "organizer__username")
    readonly_fields = ("created_at", "updated_at")


@admin.register(EventAttendee)
class EventAttendeeAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "status", "joined_at")
    list_filter = ("status",)
    search_fields = ("event__title", "user__username")
    readonly_fields = ("joined_at",)
