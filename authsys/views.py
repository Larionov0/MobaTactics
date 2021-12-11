from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from .models import UserProfile


# Create your views here.
def sign_up(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            UserProfile.create_from_user(user)

            return redirect('game:lobbies_view')
    else:
        form = UserCreationForm()
    return render(request, 'registration.html', {'form': form})
