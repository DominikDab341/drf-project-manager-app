from .models import ChatMessage
from rest_framework import serializers

class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="sender.username", read_only=True)
    class Meta:
        model = ChatMessage
        fields = ['id', 'project', 'username', 'message', 'timestamp']
        read_only_fields = ['timestamp','project']