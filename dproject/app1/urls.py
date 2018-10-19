from django.urls import include,path
from django.conf.urls import url

import sys
sys.path.append("notebooks")
import ViewsCommon
from . import views

app_name = 'app1'

urlpatterns = [
    path(r'', views.index, name='index'),
    url(r'^.*/$', ViewsCommon.Common, name='catchall'),
]
