from django.urls import path, include
from .views import *


app_name = 'game'
urlpatterns = [
    path('lobbies', lobbies_view, name='lobbies_view'),
    path('enter_lobby/<int:lobby_id>', enter_lobby, name='enter_lobby'),
    path('exit_lobby', exit_lobby, name='exit_lobby'),
    path('check_game_start', check_game_start, name='check_game_start'),
    path('game', game, name='game')
]
