from django.core.management import call_command
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MobaTactics.settings")
django.setup()
import requests
from game.models import *
from authsys.models import *

import io
from django.core.files.images import ImageFile


def create_heroes():
    base_heroes = [
        {
            'name': 'Монах',
            'max_hp': 30,
            'hp': 30,
            'damage': 5,
            'speed': 3,
            'armor': 1,
            'is_proto': True,
            'img_name': 'monah.png'
        },
        {
            'name': 'Берсерк',
            'max_hp': 20,
            'hp': 20,
            'damage': 10,
            'speed': 3,
            'armor': 0,
            'is_proto': True,
            'img_name': 'berserk.png'
        },
        {
            'name': 'Ассасин',
            'max_hp': 15,
            'hp': 15,
            'damage': 12,
            'speed': 4,
            'armor': 1,
            'is_proto': True,
            'img_name': 'assasin.png'
        },
        {
            'name': 'Бегун',
            'max_hp': 22,
            'hp': 22,
            'damage': 7,
            'speed': 5,
            'armor': 0,
            'is_proto': True,
            'img_name': 'runner.png'
        },
    ]

    for hero_dict in base_heroes:
        hero = Hero.objects.create(**{key: value for key, value in hero_dict.items() if key != 'img_name'})

        try:
            response = requests.get(f'https://moba-tactics.herokuapp.com/media/heroes_images/{hero_dict["img_name"]}')
            image = ImageFile(io.BytesIO(response.content), name=hero_dict['img_name'])
            hero.image = image
            hero.save()
        except Exception as exc:
            print(f'Не получилось спарсить картинку героя {hero_dict["name"]}:( \n{exc}')

        print(f"Hero {hero_dict['name']} created")


def create_superuser():
    user = User.objects.create_superuser('admin', '', 'admin')
    UserProfile.create_from_user(user)
    print('superuser admin created')


def create_lobbies():
    for name in ['UA lobby', 'Головне лобі', 'Поляна', 'На корову', 'Just lobby']:
        Lobby.objects.create(name=name)
        print(f"Lobby {name} created")


if __name__ == '__main__':
    call_command('migrate')
    if User.objects.count() == 0:
        create_superuser()
        create_heroes()
        create_lobbies()
