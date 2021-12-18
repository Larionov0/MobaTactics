from django.db import models
from authsys.models import UserProfile
import random
# from django.conf import settings


X_count = 5
Y_count = 4


# Create your models here.
class Lobby(models.Model):
    name = models.CharField(max_length=50, default='New lobby')
    password = models.CharField(max_length=50, default='12345')  # я знаю, что нужно хранить хэш пароля. Пока эта функция не реализована
    update_id = models.IntegerField(default=0)
    active_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='active_lobby')

    def __str__(self):
        return f"{self.name}"

    def mark_update(self):
        self.update_id += 1
        self.save()

    def set_heroes(self):
        heroes = list(Hero.objects.filter(is_proto=True))
        for user in self.userprofiles.all():
            for _ in range(4):
                hero_proto = random.choice(heroes)
                hero = hero_proto.spawn_real_from_proto()
                hero.user = user
                hero.lobby = self
                hero.save()

    def start_game(self):
        """
        Функция, вызывается на старте игры.
        Создает всех героев, и настраивает их параметры (координаты, и тд)
        :return:
        """
        first_user, second_user = list(self.userprofiles.all())
        print(first_user, second_user)
        self.active_user = first_user
        self.set_heroes()

        heroes = list(Hero.objects.filter(lobby=self, user=first_user))
        heroes[0].x = 4
        heroes[0].y = 0
        heroes[1].x = 4
        heroes[1].y = 1
        heroes[2].x = 3
        heroes[2].y = 0
        heroes[3].x = 3
        heroes[3].y = 1
        for hero in heroes:
            hero.is_active = True
            hero.hp = hero.max_hp
            hero.movement = hero.speed
            hero.save()

        heroes = list(Hero.objects.filter(lobby=self, user=second_user))
        heroes[0].x = 0
        heroes[0].y = 3
        heroes[1].x = 0
        heroes[1].y = 2
        heroes[2].x = 1
        heroes[2].y = 3
        heroes[3].x = 1
        heroes[3].y = 2
        for hero in heroes:
            hero.is_active = False
            hero.hp = hero.max_hp
            hero.movement = 0
            hero.save()

        self.save()

    def change_turn(self):
        profile1, profile2 = list(self.userprofiles.all())
        for hero in self.get_heroes_of_player(self.active_user):
            hero.is_active = False
            hero.save()

        self.active_user = profile1 if self.active_user == profile2 else profile2
        self.save()

        for hero in self.get_heroes_of_player(self.active_user):
            hero.on_move_start()

    def get_heroes_of_player(self, profile):
        return Hero.objects.filter(lobby=self, user=profile)

    @property
    def users(self):
        return [profile.user for profile in self.userprofiles.all()]

    def remove_all_heroes(self):
        for hero in Hero.objects.filter(lobby=self):
            hero.delete()

    def message(self, msg):
        return Message.objects.create(lobby=self, text=msg)

    def end_game(self):
        self.remove_all_heroes()
        Message.objects.filter(lobby=self).delete()
        ChatMessage.objects.filter(lobby=self).delete()


class Hero(models.Model):
    name = models.CharField(max_length=50, default='new hero')
    max_hp = models.IntegerField(default=25)
    hp = models.IntegerField(default=25)
    damage = models.IntegerField(default=7)
    speed = models.IntegerField(default=3)
    movement = models.IntegerField(default=3)
    armor = models.IntegerField(default=0)
    attack_range = models.IntegerField(default=1)
    is_proto = models.BooleanField(default=False)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True, blank=True)
    is_alive = models.BooleanField(default=True)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    image = models.ImageField(blank=True, null=True, upload_to='heroes_images/')  # возможно, нужно пока сделать просто строку с линком

    def __str__(self):
        return f"{self.name}"

    def make_move(self, x, y):  # FIXME: validation
        dx = abs(self.x - x)
        dy = abs(self.y - y)
        total_moves = dx + dy
        if total_moves > self.movement:
            raise Exception('Too many moves')
        self.movement -= total_moves
        self.x = x
        self.y = y
        self.save()

    def attack(self, other):
        self.user.lobby.message(f"{self.name} атаковал {other.name} с силой {self.damage}")
        other.get_damage(self.damage)
        self.is_active = False
        self.save()

    def get_damage(self, damage):
        remaining_damage = damage - self.armor
        if remaining_damage > 0:
            self.hp -= remaining_damage
            self.user.lobby.message(f"{self.name} получил {remaining_damage}/{damage} урона. Осталось {self.hp} HP")
            if self.hp <= 0:
                self.is_alive = False
                self.user.lobby.message(f"{self.name} погиб")
        self.save()

    def spawn_real_from_proto(self):
        assert self.is_proto
        new_hero = Hero.objects.create(**{field.name: self.__getattribute__(field.name) for field in Hero._meta.get_fields() if field.name != 'id'})
        new_hero.is_proto = False
        new_hero.save()
        return new_hero

    def on_move_start(self):
        self.movement = self.speed
        self.is_active = True
        self.save()


class Message(models.Model):
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    datetime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"({self.datetime}) {self.text}"


class ChatMessage(models.Model):
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE, related_name='chat_messages')
    from_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True)
    text = models.CharField(max_length=200)
    datetime = models.DateTimeField(auto_now=True)

    def to_json(self):
        return {
            "from_id": self.from_user.userprofile.id,
            "from": self.from_user.username,
            "message": self.text,
            "datetime": f"{self.datetime}"
        }
