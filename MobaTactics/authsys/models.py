from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    points = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    lobby = models.ForeignKey('game.Lobby', on_delete=models.SET_NULL, blank=True, null=True, related_name='users')

    def exit_lobby(self):
        self.lobby = None
        self.save()

    def __str__(self):
        return f"Profile {self.user}"
