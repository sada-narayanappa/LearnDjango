from django.contrib import admin
from django.urls import path, include
from django.conf.urls import include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views
from mangorest import mango
#import mango

app_name = 'mainapp'

urlpatterns = [
    path('app1/'     ,     include('app1.urls'),      name="First Application"),
    path('app2/'     ,     include('app2.urls'),      name="Second Application"),
    
    
    url(r'^accounts/',  include('allauth.urls')),
    path(r'',          views.index,             name='index'),
    url(r'^.*/$',      mango.Common,            name='catchall'),
]
urlpatterns = staticfiles_urlpatterns() + urlpatterns
