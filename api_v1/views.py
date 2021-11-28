from django.shortcuts import render
from django.http import JsonResponse
from game.models import *
from authsys.models import *
import json


def get_lobby(request) -> Lobby:
    return request.user.userprofile.lobby


def mark_update(request):
    get_lobby(request).mark_update()


def make_move(request):
    get_lobby(request).message('Кто-то походил')
    params = json.loads(request.body)
    x, y = params['x'], params['y']
    hero = Hero.objects.get(id=params['hero_id'])

    hero.make_move(x, y)
    mark_update(request)
    return JsonResponse({'ok': True})


def attack(request):
    params = json.loads(request.body)
    attacker = Hero.objects.get(id=params['hero_id'])
    target = Hero.objects.get(id=params['target_id'])
    lobby = get_lobby(request)

    attacker.attack(target)
    mark_update(request)
    # if all([not hero.is_active for hero in Lobby.get_heroes_of_player(request.user.userprofile)]):  # все ли походили
    #     lobby.change_turn()
    return JsonResponse({'ok': True})


def get_data(request):
    params = json.loads(request.body)
    update_id = params['update_id']

    lobby = get_lobby(request)
    players = [user for user in lobby.users]
    # if players[0].userprofile != lobby.active_user:
    #     players.reverse()
    players = [{"name": user.username, "user_id": user.userprofile.id} for user in players]
    if lobby.update_id != update_id:
        heroes = [{
            "id": hero.id,
            "name": hero.name,
            "max_hp": hero.max_hp,
            "hp": hero.hp,
            "damage": hero.damage,
            "speed": hero.speed,
            "movement": hero.movement,
            "armor": hero.armor,
            "attack_range": hero.attack_range,
            "x": hero.x,
            "y": hero.y,
            "is_active": hero.is_active,
            "img_src": 'https://live.staticflickr.com/7203/6875019793_b345e09ffc_b.jpg',
            "user_id": hero.user.id
        } for hero in Hero.objects.filter(lobby=lobby) if hero.is_alive]
        return JsonResponse({
            "update_id": lobby.update_id,
            "heroes": heroes,
            "messages": [message.text for message in list(lobby.message_set.all())[:15]],
            "is_my_move": request.user.userprofile == lobby.active_user,
            "winner": None,
            "chat": [],
            "players": players,
            "player_id": request.user.userprofile.id
        })
    else:
        return JsonResponse({})


def end_turn(request):
    get_lobby(request).change_turn()
    mark_update(request)
    return JsonResponse({'ok': True})
