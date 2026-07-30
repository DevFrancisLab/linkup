from django.urls import path

from .views import SendSMSView

urlpatterns = [
    path("sms/send/", SendSMSView.as_view(), name="africastalking-sms-send"),
]
