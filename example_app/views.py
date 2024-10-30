from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader


def index(request):
    rpaths = [c for c in request.path.split("/") if (c) ];
    template = f"{rpaths[0]}/index.html"
    if ( len(rpaths) > 0 ):
        try:
            loader.get_template(template)
            return render(request, template)
        except:
            pass

    return HttpResponse(f"{template} not found");