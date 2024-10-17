import pandas as pd
from django.conf import settings
from django.core.mail import send_mail
import sys, os, json

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def index(request):
    return HttpResponse("Hello")
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def readfile(file, ret=None):
    if not os.path.exists(file):
        return ret

    with (open(file, "r")) as f:
        conts = f.read()
    return conts
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def writefile(file, contents):
    with (open(file, "w")) as f:
        conts = f.write(contents)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def read_csv(file):
    if not os.path.exists(file):
        ret = {
            "name": file,
            "columns": ['col'],
            "values": [f'{file} does not exist']  # Values
        }
        return ret;

    if (file.endswith('xls') or file.endswith('xlsx')):
        df = pd.read_excel(file)
    else:
        df = pd.read_csv(file, quotechar="'",skipinitialspace=True)
    df.fillna("", inplace=True)

    df.columns = [f.strip() for f in df.columns]
    for f in df.columns:
        if df[f].dtype == 'object':
            df[f] = df[f].str.strip()
    ret = {
        "name": file,
        "columns": [f for f in df.columns],
        "values": df.values.tolist()  # Values
    }
    return df, ret
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def demail(subject="hello", msg="hello", to="geo1@geospaces.org", dfrom="", **kwargs):
    r = [f.strip() for f in to.split(",")]
    try:
        ret = send_mail( subject=subject,
                   message=msg,
                   from_email= dfrom or settings.DEFAULT_FROM_EMAIL,
                   recipient_list=r,
                   fail_silently = False)
    except Exception as e:
        print(e)
        return "Error"

    print(f'Sending Emails to {r} {ret}')
    return ret
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def uploadFiles(request, savein="/tmp/myapp", maxsize=100*1024*1024, **kwargs):
    files = []
    ret = []
    if(not os.path.exists(savein) ): 
        os.makedirs( savein )

    for f in request.FILES.getlist('file'):
        filename =  str(f)
        files.append(filename)
                
        if f.size > maxsize:
            return (f"ERROR: File of size: {f.size} for '{filename}' too big! max is: {maxsize}")
        content   = f.read()
        sfilename = f"{savein}/{filename}"
        
        dirn = os.path.dirname(sfilename)
        with open(sfilename, "wb") as f:
            f.write(content)
            
        ret.append(sfilename)
            
    return ret

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def getListOfFiles(dir="/tmp/myapp", pattern='*', maxlen=20*1024, **kwargs):
    flist = glob.glob(dir + "/**/"+pattern, recursive=True)
    return flist

