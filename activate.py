#!/usr/bin/env python
import os, sys
from dotenv import load_dotenv

if ( not os.environ.get('DEFAULT_APP','')):
    print("DEFALT APP is null, setting example app")
    load_dotenv("example_app/env")

print (f'''
This script will set up environments as expected by your default environment setting.
Current environment settings are:

    DEFAULT_APP: {os.environ['DEFAULT_APP']}
           PORT: {os.environ['PORT']}
''')

DEFAULT_APP = os.environ['DEFAULT_APP']

AP1="application_context"
AP2=f"{DEFAULT_APP}/application_context"

if (os.path.exists(AP1) and os.path.exists(AP2) and os.path.samefile(AP1, AP2) ):
    print(f"\n** {AP1} and {AP2} are same..nothing to do\n")
else:
    print(f"\n!! {AP1} and {AP2} are different..resetting\n")
    if ( os.path.islink(DEFAULT_APP)):
        LINK_APP = os.path.realpath(DEFAULT_APP)
        print(f"DEFAULT app is link is {LINK_APP}")
    else:
        LINK_APP = ""
    
    os.system("make clean")
    if (LINK_APP): 
        print(f"Creating link to  {LINK_APP}")
        os.system(f"ln -s {LINK_APP}")
        
    print(f"Creating link to  {AP2}")
    os.system(f'ln -s {AP2}')
    
    DEF_DIR=os.path.dirname(LINK_APP)
    DEP_APPS=os.environ.get("LINK_APPS", "SADA")
    print(f"Checking dependent apps  {DEP_APPS}")
    for l in DEP_APPS.split():
        ll = f"{DEF_DIR}/{l}"
        if ( os.path.exists(ll)):
            print(f"Linking {ll}")
            os.system(f"ln -s {ll}")
        else:
            print(f"Path not found: => {ll}")

print("All done!\nYou can run your app by calling\n\t make run")