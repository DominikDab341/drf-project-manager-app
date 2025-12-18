from django.urls import path
from .views import ChatMessageListAPIView


urlpatterns=[
    path("projects/<int:project_id>/chat/", ChatMessageListAPIView.as_view(), name="project-chat-messages"),
]