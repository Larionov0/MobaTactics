from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *


# Create your views here.
@login_required
def lobbies_view(request):
    request.user.userprofile.exit_lobby()
    return render(request, 'lobbies.html', {'lobbies': Lobby.objects.all()})


def enter_lobby(request, lobby_id):
    lobby = Lobby.objects.get(id=lobby_id)
    if lobby.userprofiles.count() == 2:
        return HttpResponse('Здесь уже 2 игрока')
    elif lobby.userprofiles.count() == 1 and lobby.userprofiles.all()[0] != request.user.userprofile:  # старт игры
        request.user.userprofile.lobby = lobby
        request.user.userprofile.save()
        lobby.start_game()
        return redirect('/main/game')
    else:
        request.user.userprofile.lobby = lobby
        request.user.userprofile.save()
        return render(request, 'lobby.html', {'lobby': lobby, 'user': request.user})


def exit_lobby(request):
    request.user.userprofile.exit_lobby()
    return redirect('/main/lobbies')


def check_game_start(request):
    # print(request.user.userprofile.lobby.userprofiles.count())
    # print(request.user.userprofile.lobby.userprofiles.all())
    return JsonResponse({"start": request.user.userprofile.lobby.userprofiles.count() == 2})


def game(request):
    return render(request, 'game.html', context={})
