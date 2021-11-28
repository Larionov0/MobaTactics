from django.contrib.auth.views import LoginView
from django.urls import path, include
from django.shortcuts import HttpResponse

urlpatterns = [
    path('sign_in/', LoginView.as_view(template_name='sign_in.html'))
]
