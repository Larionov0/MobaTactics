from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *


# Create your views here.
@login_required
def lobbies_view(request):
    request.user.exit_lobby()
    return render(request, 'lobbies.html', {'lobbies': Lobby.objects.all()})


def enter_lobby(request, lobby_id):
    lobby = Lobby.objects.get(id=lobby_id)
    if lobby.users.count() == 2:
        return HttpResponse('Здесь уже 2 игрока')
    elif lobby.users.count() == 1 and lobby.users.all()[0] != request.user:
        start_game()
        return redirect('/main/game')
    else:
        request.user.lobby = lobby
        request.user.save()
        return render(request, 'lobby.html', {'lobby': lobby, 'user': User})


def exit_lobby(request):
    request.user.exit_lobby()
    return redirect('/main/lobbies')


def check_game_start(request):
    return JsonResponse({"start": request.user.lobby.users.count() == 2})


def game(request):
    return HttpResponse('GAME')


def start_game():
    pass
