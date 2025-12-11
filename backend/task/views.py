from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, filters
from .models import Task
from .serializers import TaskSerializer, TaskListSerializer
from django.db.models import Q
from rest_framework.decorators import action
from user.permissions import IsManager
from task.permissions import IsTaskOwner
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

class TaskPagination(PageNumberPagination):
        page_size = 3

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = "id"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'assigned_to', 'project']
    search_fields = ['title', 'description']
    ordering_fields = ['deadline', 'status', 'title']

    pagination_class = TaskPagination

    def get_permissions(self):
        if self.action in ['create','destroy']:
            permission_classes = [IsManager]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsTaskOwner]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        
        if getattr(user, 'role') == 'MANAGER' or user.is_superuser:
             return Task.objects.all()
        
        return Task.objects.filter(assigned_to=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        else:
            return TaskSerializer


