##---------------------------------------------------------------------
import re, os, datetime, sys, json, hashlib
from   mangorest.mango import webapi
import shutil

##---------------------------------------------------------------------
@webapi("/ui/test")
def test(request, **kwargs):
    par = dict(request.GET)
    par.update(request.POST)
    par["FILES"] = []

    print(request.FILES.keys())

    for k in request.FILES.keys():
        for f in request.FILES.getlist(k):
            content = f.read()
            filename = f"/tmp/{f}"
            print(f"++ Save file {filename} Content: {len(content)} :")
            with open(filename, "wb") as f:
                f.write(content)

            par["FILES"].append(filename)

    ret = json.dumps(par, indent=4)

    return ret