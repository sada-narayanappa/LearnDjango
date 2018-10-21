from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
#from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import json
import sys
import re

'''<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
It gets a file content for multipart files 
saves them ina  base directory - for now I have chosen /tmp - it can be changed"
'''
def getFile(request):
    BASEDIR = "/tmp"
    parameters = dict(request.POST)

    file = request.FILES.get('file')
    content = file.read().decode()
    userID =  parameters['user_id'][0] if 'user_id' in parameters else "no_user"
    saveAS =  parameters['save_as'][0] if 'save_as' in parameters else str(file)
    saveAS =  str(file) if not saveAS.strip() else saveAS.strip()
    
    filename = f"{BASEDIR}/{userID}/{saveAS}"
    basedirt = os.path.dirname(filename)
    ret = f'{userID} {saveAS} {filename} {content[0:100]}'
    print("+++====>", ret, "FileName:", file)
    
    if(not os.path.exists(basedirt) ): os.makedirs(basedirt) 
        
    with open(filename, "w") as f:
        f.write(content)
    
    return( HttpResponse(ret) )
