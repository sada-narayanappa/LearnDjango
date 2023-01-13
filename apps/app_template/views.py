from django.http import HttpResponse


def index(request):
    return HttpResponse("app_template Version 1.0");
