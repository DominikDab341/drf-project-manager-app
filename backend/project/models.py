from django.db import models
from user.models import User
from django.db.models import Count, Q

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='project_member')

    def __str__(self):
        return self.title

    def get_statistics(self):
        return self.tasks_for_project.aggregate(
            total=Count('id'),
            todo=Count('id', filter=Q(status='TO_DO')),
            done=Count('id', filter=Q(status='DONE')),
            in_progress=Count('id', filter=Q(status='IN_PROGRESS'))
        )

    def get_members_without_tasks(self):
        members_without_tasks = self.members.exclude(tasks__project=self)
        return members_without_tasks
