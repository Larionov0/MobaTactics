from django.urls import path
from .views import *

urlpatterns = [
    path('get_data', get_data),
    path('make_move', get_data),
    path('attack', get_data),
    path('end_turn', get_data),
]
