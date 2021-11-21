from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    points = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    lobby = models.ForeignKey('game.Lobby', on_delete=models.SET_NULL, blank=True, null=True, related_name='users')

    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'

    def exit_lobby(self):
        self.lobby = None
        self.save()
