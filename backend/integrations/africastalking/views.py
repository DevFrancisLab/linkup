from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from .sms import SMSProviderError, send_sms
from .ussd import UssdRequest, handle_ussd_request


class SMSRateThrottle(UserRateThrottle):
    rate = "10/hour"


class SendSMSSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20, trim_whitespace=True)
    message = serializers.CharField(max_length=1600, trim_whitespace=True)


class SendSMSView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SMSRateThrottle]

    def post(self, request):
        serializer = SendSMSSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            send_sms(**serializer.validated_data)
        except ValueError as error:
            return Response({"detail": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        except SMSProviderError as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "success": True,
                "message": "SMS queued successfully.",
                "provider": "Africa's Talking",
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class UssdCallbackView(View):
    http_method_names = ["post"]

    def post(self, request):
        service_code = request.POST.get("serviceCode", "")
        if (
            settings.AT_USSD_SERVICE_CODE
            and service_code != settings.AT_USSD_SERVICE_CODE
        ):
            return HttpResponse(
                "END Invalid service code.",
                content_type="text/plain; charset=utf-8",
            )
        response = handle_ussd_request(
            UssdRequest(
                session_id=request.POST.get("sessionId", ""),
                service_code=service_code,
                phone_number=request.POST.get("phoneNumber", ""),
                text=request.POST.get("text", ""),
            )
        )
        return HttpResponse(response, content_type="text/plain; charset=utf-8")
