from django.shortcuts import render
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import viewsets, permissions, status, filters
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer
from user.serializers import UserSerializer
from user.models import User
from rest_framework.decorators import action
from user.permissions import IsManager
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.pagination import PageNumberPagination

class ProjectPagination(PageNumberPagination):
    page_size = 3
    # page_size_query_param = 'page_size'
    # max_page_size = 100

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['owner', 'members']
    search_fields = ['title', 'description']
    ordering_fields = ['title']

    pagination_class = ProjectPagination

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy', 'partial_update','users_without_tasks', 'candidates', 'add_member']:
            permission_classes = [IsManager]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        users_projects = Project.objects.filter( Q(members=user) | Q(owner=user)).distinct()
        return users_projects
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        else:
            return ProjectSerializer

    @action(detail=True, methods=['GET'])
    def members(self, request, id):
        project = self.get_object()
        members = project.members.all()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'], url_path='tasks-status')
    def tasks_status(self, request, id):
        project = self.get_object()
        tasks_to_do = project.get_number_of_todo_tasks()
        done_tasks = project.get_number_of_done_tasks()
        tasks_in_progress = project.get_number_of_in_progress_tasks()
        total_number_of_tasks = tasks_to_do + done_tasks + tasks_in_progress
        return Response({'tasks_todo':tasks_to_do, 'done_tasks': done_tasks, 'tasks_in_progress': tasks_in_progress, 'total_number_of_tasks': total_number_of_tasks})

    @action(detail=True, methods=['GET'], url_path='without-tasks')
    def users_without_tasks(self, request,id):
        project = self.get_object()
        users = project.get_members_without_tasks()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail =True, methods=['GET'])
    def candidates(self, request, id):
        project = self.get_object()
        members_ids = project.members.values_list('id',flat=True)
        candidates = User.objects.exclude(id__in=members_ids).exclude(id=request.user.id).exclude(is_superuser=True).exclude(role = User.Role.MANAGER)
        serializer = UserSerializer(candidates, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    @action(detail=True, methods=['POST'])
    def add_member(self, request, id):
        project = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'error': 'No user_id field provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            project.members.add(user)
            
            return Response(
                {'status': 'success', 'message': f'You have added {user.username}'}, 
                status=status.HTTP_200_OK
            )
        
        except User.DoesNotExist:
            return Response(
                {'error': 'That user doesnt exist'}, 
                status=status.HTTP_404_NOT_FOUND
            )
