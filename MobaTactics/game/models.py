from django.db import models
from authsys.models import UserProfile
# from django.conf import settings


# Create your models here.
class Lobby(models.Model):
    name = models.CharField(max_length=50, default='New lobby')
    password = models.CharField(max_length=50, default='12345')  # я знаю, что нужно хранить хэш пароля. Пока эта функция не реализована
    update_id = models.IntegerField(default=0)
    active_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='active_lobby')

    def __str__(self):
        return f"{self.name}"


class Hero(models.Model):
    name = models.CharField(max_length=50, default='new hero')
    max_hp = models.IntegerField(default=25),
    hp = models.IntegerField(default=25)
    damage = models.IntegerField(default=7)
    speed = models.IntegerField(default=3)
    movement = models.IntegerField(default=3)
    armor = models.IntegerField(default=0)
    attack_range = models.IntegerField(default=1)
    is_proto = models.BooleanField(default=False)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True, blank=True)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    img_src = models.ImageField(blank=True, null=True)  # возможно, нужно пока сделать просто строку с линком

    def __str__(self):
        return f"{self.name}"


class Message(models.Model):
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    datetime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"({self.datetime}) {self.text}"


class ChatMessage(models.Model):
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)
    from_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True)
    text = models.CharField(max_length=200)
    datetime = models.DateTimeField(auto_now=True)
