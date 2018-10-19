"""dproject URL Configuration
  
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url, include
from django.http import HttpResponseRedirect
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url(r'^$', lambda r: HttpResponseRedirect('/static/index.html')),
    path('admin/', admin.site.urls),
    url(r'^accounts/', include('django_registration.backends.activation.urls')),
    url(r'^accounts/', include('django.contrib.auth.urls')),

    url('^api1/', include('api1.urls')),
    url(r'^app1/', include('app1.urls')),
]

