
from rest_framework import generics
from .serializers import ChatMessageSerializer
from .models import ChatMessage

class ChatMessageListAPIView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    queryset = ChatMessage.objects.all()

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return self.queryset.filter(project_id=project_id).order_by("-timestamp")