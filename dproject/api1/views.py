from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
#from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import pandas as pd
import sys
import re
import subprocess
sys.path.append("notebooks")
import ViewsCommon
from datetime import datetime
import threading
from numba import njit
from multiprocessing import Pool

APPNAME='api1'
#--------------------------------------------------------------------------------
def index(request):
    return HttpResponse("api1/ Version 1.0");
#--------------------------------------------------------------------------------
