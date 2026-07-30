from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    phone = models.CharField(max_length=20)

    profession = models.CharField(
        max_length=100,
        blank=True
    )

    company = models.CharField(
        max_length=100,
        blank=True
    )

    bio = models.TextField(blank=True)

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username
