from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000, trim_whitespace=True)
    event_id = serializers.IntegerField(required=False, allow_null=True, min_value=1)
    session_id = serializers.UUIDField(required=False)
