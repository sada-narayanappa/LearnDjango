from django.urls import path
from . import views

app_name = 'app1'

urlpatterns = [
    path('LINK/',  views.index , name='app1 urls1'),
]
