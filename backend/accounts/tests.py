from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationAPITests(APITestCase):
    register_url = "/api/auth/register/"
    login_url = "/api/auth/login/"
    profile_url = "/api/auth/profile/"
    refresh_url = "/api/auth/token/refresh/"
    logout_url = "/api/auth/logout/"

    def register_user(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "francis",
                "first_name": "Francis",
                "last_name": "Kariuki",
                "email": "francis@example.com",
                "phone": "+254700000000",
                "password": "secure-password-123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response

    def test_registration_creates_profile(self):
        response = self.register_user()

        user = User.objects.get(username="francis")
        self.assertEqual(user.userprofile.phone, "+254700000000")
        self.assertEqual(response.data["user"]["email"], "francis@example.com")

    def test_registration_rejects_duplicate_identity_and_weak_password(self):
        self.register_user()

        duplicate_response = self.client.post(
            self.register_url,
            {
                "username": "francis",
                "first_name": "Francis",
                "last_name": "Kariuki",
                "email": "another@example.com",
                "phone": "+254700000000",
                "password": "secure-password-123",
            },
            format="json",
        )
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            duplicate_response.data["username"][0],
            "This username is already in use.",
        )

        weak_password_response = self.client.post(
            self.register_url,
            {
                "username": "another-user",
                "first_name": "Another",
                "last_name": "User",
                "email": "another@example.com",
                "phone": "+254700000001",
                "password": "password",
            },
            format="json",
        )
        self.assertEqual(weak_password_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", weak_password_response.data)

    def test_login_by_email_and_profile_update(self):
        self.register_user()
        login_response = self.client.post(
            self.login_url,
            {"identifier": "francis@example.com", "password": "secure-password-123"},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        access = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        update_response = self.client.put(
            self.profile_url,
            {
                "username": "francis-k",
                "email": "francis.k@example.com",
                "profession": "Product Builder",
                "company": "LinkUp",
            },
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["profession"], "Product Builder")
        self.assertEqual(update_response.data["username"], "francis-k")
        self.assertEqual(update_response.data["email"], "francis.k@example.com")

        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["company"], "LinkUp")

    def test_refresh_and_logout_blacklists_token(self):
        self.register_user()
        login_response = self.client.post(
            self.login_url,
            {"identifier": "francis", "password": "secure-password-123"},
            format="json",
        )
        refresh = login_response.data["refresh"]
        access = login_response.data["access"]

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        rotated_refresh = refresh_response.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        logout_response = self.client.post(
            self.logout_url,
            {"refresh": rotated_refresh},
            format="json",
        )
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        blacklisted_refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": rotated_refresh},
            format="json",
        )
        self.assertEqual(blacklisted_refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_profile_requires_bearer_token(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "Authentication credentials were not provided.")

    def test_logout_requires_authentication(self):
        response = self.client.post(self.logout_url, {"refresh": "invalid"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_login_returns_validation_error(self):
        response = self.client.post(
            self.login_url,
            {"identifier": "unknown", "password": "wrong-password"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["non_field_errors"][0],
            "Invalid username/email or password.",
        )

    def test_jwt_lifetimes_and_rotation_are_configured(self):
        self.assertEqual(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"], timedelta(minutes=30))
        self.assertEqual(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"], timedelta(days=7))
        self.assertTrue(settings.SIMPLE_JWT["ROTATE_REFRESH_TOKENS"])
        self.assertTrue(settings.SIMPLE_JWT["BLACKLIST_AFTER_ROTATION"])
        self.assertEqual(settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["anon"], "20/minute")
        self.assertEqual(settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["user"], "120/minute")
