from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from . import views_channels
from mangorest import mango
from django.conf import settings
#from . import settings

app_name = 'geoapp' 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path(r'uploadfile/', views.uploadfile, name='uploadfile'),
    path(r'contactus/', views.contactus, name='uploadfile'),

    path(r'broadcast/', views_channels.broadcast, name='brodcast'),

    path(r'', views.index, name='index'),

] + settings.DETECTED_URLS + [
    path('oidc/', include('mozilla_django_oidc.urls')),
    re_path(r'^.*/$', mango.Common, name='catchall'),
]

#urlpatterns = staticfiles_urlpatterns() + urlpatterns
urlpatterns =  urlpatterns
#print("++ geoapp/urls.py: urlpatterns:", urlpatterns)
'''
To enable single sign on: 

Step 1: Add following line to urlpatterns:
    path('oidc/', include('mozilla_django_oidc.urls')),

Step 2: 
'''