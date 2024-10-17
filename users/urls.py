from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('users/'      , views.users      , name='List Users'),
    path('email/'      , views.email      , name='Email Users'),
]
