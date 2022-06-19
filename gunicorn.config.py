#!/usr/local/bin/python
"""gunicorn WSGI server configuration."""

import os,sys
sys.path.append("..")
#from  aiservices import run

PORT=8013
print (f"Using Port {PORT}" )

from multiprocessing import cpu_count
from os import environ


def max_workers():    
    #return max(1, int(cpu_count()/2))
    return 4


bind = '0.0.0.0:' + environ.get('PORT', str(PORT) )
max_requests = 20
worker_class = 'gevent'
workers = max_workers()

