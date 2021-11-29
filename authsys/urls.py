from django.contrib.auth.views import LoginView
from django.urls import path, include
from django.shortcuts import HttpResponse
import django.contrib.auth.views
from .views import *

urlpatterns = [
    path('sign_in/', LoginView.as_view(template_name='sign_in.html')),
    path('sign_up/', sign_up, name='sign_up'),
    path('logout/', django.contrib.auth.views.LogoutView.as_view(next_page='/'))
]
