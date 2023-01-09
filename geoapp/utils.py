import pandas as pd
from django.http import HttpResponse
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
def demail(subject="hello", msg="hello", to="sada@geospaces.org"):
    r = [f.strip() for f in to.split(",")]
    try:
        ret = send_mail( subject=subject,
                   message=msg,
                   from_email=settings.DEFAULT_FROM_EMAIL,
                   recipient_list=r,
                   fail_silently = False)
    except Exception as e:
        print(e)
        return "Error"

    print(f'Sending Emails to {r} {ret}')
    return ret
