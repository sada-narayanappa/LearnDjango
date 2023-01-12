from django.urls import path
from . import views

app_name = 'app_template'

urlpatterns = [
    path('LINK/',  views.index , name='Somename urls1'),
]
