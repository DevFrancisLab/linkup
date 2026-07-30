from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from PIL import Image, UnidentifiedImageError
from rest_framework import serializers

from .models import UserProfile

User = get_user_model()

MAX_AVATAR_SIZE = 5 * 1024 * 1024
ALLOWED_AVATAR_TYPES = {"image/jpeg", "image/png", "image/webp"}


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name", allow_blank=True)
    last_name = serializers.CharField(source="user.last_name", allow_blank=True)
    email = serializers.EmailField(source="user.email", allow_blank=True)
    interests = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
    )
    looking_for = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
    )

    class Meta:
        model = UserProfile
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "profession",
            "company",
            "bio",
            "interests",
            "looking_for",
            "avatar",
        )
        extra_kwargs = {
            "phone": {"required": False, "allow_blank": True},
            "profession": {"required": False, "allow_blank": True},
            "company": {"required": False, "allow_blank": True},
            "bio": {"required": False, "allow_blank": True},
            "avatar": {"required": False, "allow_null": True},
        }

    def validate_username(self, value):
        user = self.instance.user
        if User.objects.exclude(pk=user.pk).filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def validate_email(self, value):
        user = self.instance.user
        if value and User.objects.exclude(pk=user.pk).filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value

    def validate_avatar(self, value):
        if value is None:
            return value
        if value.size > MAX_AVATAR_SIZE:
            raise serializers.ValidationError("Avatar must be 5 MB or smaller.")
        if value.content_type not in ALLOWED_AVATAR_TYPES:
            raise serializers.ValidationError("Use a JPEG, PNG, or WebP image.")
        try:
            Image.open(value).verify()
        except (UnidentifiedImageError, OSError) as error:
            raise serializers.ValidationError("Upload a valid image file.") from error
        finally:
            value.seek(0)
        return value

    @transaction.atomic
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        avatar_changed = "avatar" in validated_data
        previous_avatar_name = instance.avatar.name
        avatar_storage = instance.avatar.storage
        for field, value in user_data.items():
            setattr(instance.user, field, value)
        instance.user.save()
        profile = super().update(instance, validated_data)
        if (
            avatar_changed
            and previous_avatar_name
            and previous_avatar_name != profile.avatar.name
        ):
            avatar_storage.delete(previous_avatar_name)
        return profile


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value

    def validate(self, attrs):
        user = User(
            username=attrs["username"],
            first_name=attrs["first_name"],
            last_name=attrs["last_name"],
            email=attrs["email"],
        )
        try:
            validate_password(attrs["password"], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({"password": error.messages}) from error
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        phone = validated_data.pop("phone")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        profile = user.userprofile
        profile.phone = phone
        profile.save(update_fields=["phone"])
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        identifier = attrs["identifier"].strip()
        user = User.objects.filter(username__iexact=identifier).first()
        if user is None:
            user = User.objects.filter(email__iexact=identifier).first()

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=user.username if user else identifier,
            password=attrs["password"],
        )
        if authenticated_user is None:
            raise serializers.ValidationError("Invalid username/email or password.")

        attrs["user"] = authenticated_user
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
