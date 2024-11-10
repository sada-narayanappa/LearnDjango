from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
import datetime

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

VERSION= f"version 1.1 {datetime.datetime.now()}"

def info(request):
    import os

    keys = "VARIABLE1 VARIABLE2 SECRET1 SECRET2 PORT DEAFAULT_APP".split()
    ctxt = {k:os.environ.get(k, "NOT-SET") for k in keys}
    
    ctxt['version'] = VERSION
    ctxt['podname'] = f"{request.META.get('REMOTE_ADDR')}"
    
        
    return render(request, "example_app/info.html", ctxt)
