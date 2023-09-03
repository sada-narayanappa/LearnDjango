#!/usr/local/bin/python 

#*** DO NOT EDIT - GENERATED FROM services.ipynb ****

import os
from  mangorest.mango import webapi
#--------------------------------------------------------------------------------------------------------    
@webapi("/app1/test")
def test( request,  **kwargs):
    return "APP 1 TEST version 1.0"
#--------------------------------------------------------------------------------------------------------    
@webapi("/app1/uploadfile")
def uploadfile( request,  **kwargs):
    par = dict(request.GET)
    par.update(request.POST)

    DESTDIR ="/tmp/MYAPP/"
    print("uploadfile : ", DESTDIR, kwargs)
    
    if (not os.path.exists(DESTDIR)):
        os.makedirs(DESTDIR)
    
    ret = "Files:\n"
    for f in request.FILES.getlist('file'):
        content = f.read()
        filename = f"{DESTDIR}{str(f)}"
        print(f"++ Save file {filename} Content: {len(content)} :")
        with open(filename, "wb") as f:
            f.write(content)
        ret += filename + "\n"

    print(" Retuning ", ret )
    return ret
#--------------------------------------------------------------------------------------------------------    
@webapi("/app1/processfile")
def processfile( request, **kwargs):
    print("processing file: ", kwargs)

    ret = uploadfile(request, **kwargs)
    ret1= "Processed: \n"
    for f in ret.split('\n')[1:]:
        if ( not f):
            continue;
        # do something and return the results
        
        print("processing file: ", f)
        ret1 += f"{f} => Processed\n"
    
    return ret + "\n\n" + ret1;
