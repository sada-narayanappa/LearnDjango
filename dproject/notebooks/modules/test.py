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


def test1(request):
    return HttpResponse(1);

#--------------------------------------------------------------------------------
def searchTerm(request):
    q = request.GET.get( 'q', "")
    ret = [
        { 'value': 'Andorra', 'data': 'AD' },
        { 'value': 'Zimbabwe', 'data': 'ZZ' },
        { 'value': '1AAndorra', 'data': 'AD1' },
        { 'value': '2BAndorra', 'data': 'AD2' },
        { 'value': '3CAndorra', 'data': 'AD3' },
    ];
    ret = json.dumps(ret)
    return HttpResponse(ret);
    