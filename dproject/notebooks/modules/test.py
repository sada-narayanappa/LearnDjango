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
import requests #install from: http://docs.python-requests.org/en/master/

def searchNewsMashape(q, proxies={ "http": None, "https": None }):
    q = "Donald%20Trump" if not q else q#the search query
    Your_X_Mashape_Key = "i7NAd0phvimsh5TbLJN02Xy7fCUBp1nsADljsnIQQ94H6oYsGq";

    #The query parameters: (update according to your search query)
    count = 10 #the number of items to return
    autoCorrect = True #autoCorrectspelling

    whost='https://contextualwebsearch-websearch-v1.p.mashape.com/api/Search'
    response=requests.get(f"{whost}/WebSearchAPI?q={q}&count={count}&autocorrect={autoCorrect}",
    headers={
    "X-Mashape-Key": Your_X_Mashape_Key,
    "Accept": "application/json"
    }, proxies=proxies
    ).json()

    #Get the numer of items returned
    totalCount = response["totalCount"];

    #Get the list of most frequent searches related to the input search query
    relatedSearch = response["relatedSearch"]

    ret = []
    #Go over each resulting item
    for webPage in response["value"]:
        url = webPage["url"]
        title = webPage["title"].encode('utf-8').strip()
        description = webPage["description"]
        keywords = webPage["keywords"]
        provider = webPage["provider"]["name"]
        datePublished = webPage["datePublished"]

        #Get the web page image (if exists)
        imageUrl = webPage["image"]["url"]
        imageHeight = webPage["image"]["height"]
        imageWidth = webPage["image"]["width"]

        thumbnail = webPage["image"]["thumbnail"]
        thumbnailHeight = webPage["image"]["thumbnailHeight"]
        #thumbnailWidth == webPage["image"]["thumbnailWidth"]

        #An example: Output the webpage url, title and published date:
        print(f"Url: {url}. Title: {title}. Published Date:{datePublished}.")
        
        ret.append({'value': title, 'data': url})
        
    return ret;

def test1(request):
    return HttpResponse(1);

#--------------------------------------------------------------------------------
def searchItems(request):
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

#--------------------------------------------------------------------------------
def searchNews(request):
    q = request.GET.get( 'q', "")
    ret = searchNewsMashape(q)
    #ret = json.dumps(ret)
    return HttpResponse(ret);
