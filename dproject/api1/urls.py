from django.urls import include,path
from django.conf.urls import url

import sys
sys.path.append("notebooks")
import ViewsCommon
from . import views

app_name = 'api'

urlpatterns = [
    path(r'', views.index, name='index'),
    url(r'^debug/.*$', ViewsCommon.Debug, name='Debug'),
    #url(r'^q/.*$', ViewsCommon.Query, name='Run Query'),
    url(r'^.*/$', ViewsCommon.Common, name='catchall'),
]

