from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import os

# Create your views here.
def page1(request):
    return render(request, 'index.html')
#----------------------------------------------------------------
DEFAULT_LIST= '''{
"columns": [0, 1, 2, 3],
"values" : [
    ["id1", "Matrix Multip", "", "https://www.youtube.com/embed/LXKku-IbSak"],
    ["id2", "Life goes on ", "", "https://www.youtube.com/embed/Hg7BGS7ap3I"],
    ["id3", "Mistake/Mystique", "", "https://www.youtube.com/embed/VQrhl7KJ0m4"]
]
}'''
def getmenu(request, topic=None, **kwargs):
    print(f"Getting menu for topic: {topic}")
    
    return HttpResponse( DEFAULT_LIST )