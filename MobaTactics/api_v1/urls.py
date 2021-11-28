from django.urls import path
from .views import *

urlpatterns = [
    path('get_data', get_data),
    path('make_move', make_move),
    path('attack', attack),
    path('end_turn', end_turn),
]
