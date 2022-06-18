from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import os

APPNAME='app1'

# Create your views here.
def page1(request):
    return render(request, 'index.html')


