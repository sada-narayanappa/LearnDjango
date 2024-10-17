from django.http import HttpResponse
import sys, os, json
from mangorest import mango
sys.path.append("/opt/utils/geo_utils/")
from services.gen.DBBase import DBBase
from services.gen.DBSQLAlchemy import DBSQLAlchemy

def index(request):
    #Check if shopping cart has items
    return HttpResponse("Hello")
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def users(request, **kwargs):
    dbname = '//opt//utils//db.sqlite3'
    #dbname = 'db.sqlite3'

    if (os.path.exists(dbname)):
        db = DBSQLAlchemy(f'sqlite://{dbname}')
        ret = db.Q(q="SELECT * from auth_user order by last_login desc")
        ret = {
            "name": "Users",
            "columns": ret[0]['columns'],
            "values": ret[0]['values']
        }
    else:
        ret = {"values": []}

    return HttpResponse( json.dumps(ret) )
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
def email(request, **kwargs):
    defmsg = '''
    Hello,
    
    How are you? We have not seen you for a long time. It has been a while since you visited us.
    
    Please checkout new changes at https://www.geospaces.org. We hope you enjoy your visit
    
    Thank you
    P.S. If you like to unsubscribe - please click here: https://www.geospaces.org/unsubscribe/?email=""
    
    '''

    parms = mango.getparms(request)
    subj  = parms.get("subj", "Hello From Geospaces")
    mesg  = parms.get("mesg", defmsg)
    resc  = parms.get("to"  , "sada.narayanappa@gmail.com")

    demail(subj, mesg, resc)
    return HttpResponse(f"To: {resc}</br></br>Subject: {subj} </br>Msg: {mesg} </br></br>Sent")


