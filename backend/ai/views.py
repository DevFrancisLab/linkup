from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from .serializers import ChatRequestSerializer
from .services.conversation_service import (
    get_conversation_history,
    get_session_id,
    store_conversation_exchange,
)
from .services.context_service import build_assistant_context
from .services.groq_service import AIProviderError
from .services.prompt_service import (
    AIResponseFormatError,
)
from .services.assistant_service import respond_to_assistant_request


class AIChatRateThrottle(UserRateThrottle):
    rate = "30/hour"


class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIChatRateThrottle]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = get_session_id(serializer.validated_data.get("session_id"))
        try:
            context = build_assistant_context(
                request.user,
                event_id=serializer.validated_data.get("event_id"),
            )
            history = get_conversation_history(request.user, session_id)
            response_data = respond_to_assistant_request(
                context,
                history,
                serializer.validated_data["message"],
            )
        except Http404:
            return Response(
                {"detail": "Event not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except AIProviderError as error:
            return Response({"detail": str(error)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except AIResponseFormatError as error:
            return Response({"detail": str(error)}, status=status.HTTP_502_BAD_GATEWAY)

        store_conversation_exchange(
            request.user,
            session_id,
            serializer.validated_data["message"],
            response_data["reply"],
        )
        return Response({"session_id": session_id, **response_data})
