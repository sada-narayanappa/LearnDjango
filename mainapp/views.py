from django.shortcuts import render

APPNAME   ='mainapp'

def index(request):
    return render(request, 'index.html')


