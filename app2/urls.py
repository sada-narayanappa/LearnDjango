from django.urls import include,path
from django.conf.urls import url

import sys
import mainapp
from . import views

app_name = 'app2'

urlpatterns = [
    path(r''          , mainapp.views.index , name='index'),
    path(r'getmenu/'  , views.getmenu,        name='menu'),
]

