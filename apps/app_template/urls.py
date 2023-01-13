from django.urls import path
from . import views

app_name = 'app_template'

urlpatterns = [
    path('vtest/',  views.index , name='Somename for this service'),
]
