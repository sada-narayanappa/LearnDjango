#!/usr/bin/env python
'''
    GENERATED FROM geoapp/notebooks/analytics.ipynb
'''
##---------------------------------------------------------------------
import os, logging, sys, datetime
from  mangorest.mango import webapi
import colabexts.utils as colabexts_utils
import pandas as pd

loga  = logging.getLogger( "app.analytics")

file  = "/opt/data/tseries/data/_ANALYTICS/analytics.log"
if  not os.path.exists(os.path.dirname(file)) :
    os.makedirs(os.path.dirname(file))
    
fmt   = logging.Formatter(fmt='%(message)s,%(asctime)-12s', datefmt='%Y-%m-%dT%H:%M:%S' )
fileh = logging.FileHandler(file)
fileh.setFormatter(fmt)
loga.addHandler(fileh)
loga.propagate = False

__ADD_STREAM__ = 0
if __ADD_STREAM__:
    sh = logging.StreamHandler()
    sh.setFormatter(fmt) 
    loga.addHandler(sh)

loga.info(f"#user,uri,method,REMOTE_ADDR,time")

def loganalytics(r):
    try:
        uri,reqm,remt = r.build_absolute_uri(), r.META.get('REQUEST_METHOD',''), \
                        r.META.get('REMOTE_ADDR','')
    except:
        uri,reqm,remt =  "URI", "method", "remote-ip"
        pass

    out = f"{r.user},{uri},{reqm},{remt}"
    loga.error(f"{out}")


#------------------------------------------------------------------------------
@webapi("/geotics/accesscount")
def userscount( request=None, **kwargs):
    cols =[c.strip() for c in "#user,uri,method,REMOTE_ADDR,time"[1:].split(",")]
    df = pd.read_csv(file, comment='#', header=None)
    df.columns=cols
    df.time=pd.to_datetime(df.time)

    df1w = df[df.time >= datetime.datetime.now() - datetime.timedelta(weeks=2)].copy()
    df1w['date'] = [c.split()[0] for c in df1w.time.astype(str)]
    dfp = df1w.pivot_table(index="date",values="REMOTE_ADDR", aggfunc="count")

    ret = {
        "name" : "accesscount",
        'index': [c for c in dfp.index],
        'columns': [c for c in dfp.columns],
        'values' : dfp.values.tolist()        
    }
    return ret

#------------------------------------------------------------------------------
@webapi("/geotics/uaccesscount")
def uuserscount( request=None, **kwargs):
    cols =[c.strip() for c in "#user,uri,method,REMOTE_ADDR,time"[1:].split(",")]
    df = pd.read_csv(file, comment='#', header=None)
    df.columns=cols
    df.time=pd.to_datetime(df.time)

    df1w = df[df.time >= datetime.datetime.now() - datetime.timedelta(weeks=2)].copy()
    df1w['date'] = [c.split()[0] for c in df1w.time.astype(str)]
    dfp = df1w.pivot_table(index="date",values="REMOTE_ADDR", aggfunc=lambda x: len(x.unique()))

    ret = {
        "name" : "accesscount",
        'index': [c for c in dfp.index],
        'columns': [c for c in dfp.columns],
        'values' : dfp.values.tolist()        
    }
    return ret


if __name__ == '__main__' or colabexts_utils.inJupyter():
    pass
