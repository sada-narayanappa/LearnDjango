from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views
from mangorest import mango
import apps.settings 
from . import settings

app_name = 'geoapp'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path(r'uploadfile', views.uploadfile, name='uploadfile'),
    path(r'', views.index, name='index'),
] + settings.DETECTED_URLS + [
    path('oidc/', include('mozilla_django_oidc.urls')),
    re_path(r'^.*/$', mango.Common, name='catchall'),
]
urlpatterns = staticfiles_urlpatterns() + urlpatterns


'''
To enable single sign on: 

Step 1: Add following line to urlpatterns:
    path('oidc/', include('mozilla_django_oidc.urls')),

Step 2: 
'''