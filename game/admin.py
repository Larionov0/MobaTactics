from django.contrib import admin
from .models import *

# Register your models here.
for model in [Lobby, Hero, Message, ChatMessage]:
    admin.site.register(model)
