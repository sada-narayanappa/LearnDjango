from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
#from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import json
import pandas as pd
import sys
import re
import subprocess
import pkgutil

sys.path.append("../notebooks")
from datetime import datetime
import threading
from numba import njit
from multiprocessing import Pool
#--------------------------------------------------------------------------------
def index(request):
    return HttpResponse("Version 1.0");
#--------------------------------------------------------------------------------
def Query(request):
    q = request.GET.get( 'q', '')
    return HttpResponse(q);
#--------------------------------------------------------------------------------
def Debug(request, APPNAME=''):
    rpath = request.path.split('/')[-2] #en(APPNAME)+2:-1]
    template = "/templates/" + rpath;
    pyModule = rpath;
    
    print(f"{template} Requested")
    getlist = [ c for c in request.GET.items()]
    ret = f''' <pre>\n Response Object: \n{os.getcwd()} path_info:{request.path_info}: final:{rpath}
               Page exists:  {template} : {os.path.exists(template)}
               Page exists:  {pyModule} : {os.path.exists(pyModule)}
               {getlist} </pre> '''
    return HttpResponse(ret);
#--------------------------------------------------------------------------------
def CommonPython(request):
    rpath = request.path[len(APPNAME)+2:-1]
    pyMethod = rpath;
 
    if (not pyMethod.startswith("modules") ):
        return HttpResponse(f"{rpath} not understood 0")
        
    func='modules.test1.test3'
    spl = func.split('.');
 
    if ( len(spl) < 2):
        print("Hmmm ... need module name")
        return HttpResponse(f"{rpath} not understood 2");
    
    modName = ".".join(spl[:-1])
    funName = spl[-1]
    for v in sys.modules:
        if (v.startswith(modName)):
            method= getattr(sys.modules[v], funName)
            print(v, type(v), funName, method, type(method), callable(method))
            return method(request)
        
    return HttpResponse(f"{rpath} not understood3 ");
    
#--------------------------------------------------------------------------------
@login_required(login_url='/accounts/login/')
def CommonSecured(request, apage):
    return render(request, apage)
#--------------------------------------------------------------------------------
def Common(appName, request):
    rpath = request.path[len(APPNAME)+2:-1]
    template = appName + "/templates/" + rpath;
    
    if ( os.path.exists(template) and template.find("/secured/") < 0) : 
        return render(request, rpath)
    if ( os.path.exists(template) ):
        return CommonSecured(request, rpath)
    else:
        return HttpResponse(f"{rpath} not understood");
