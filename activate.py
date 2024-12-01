#!/usr/bin/env python
import os, sys
from dotenv import load_dotenv

''' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Searches for the directory containg this app
'''
def searchfor(app="app", max_depth=2):
    if ( os.path.islink(app) or os.path.exists(app)):
        print(f"{app} already exists in the current folder!")
        return "./app"
    upapp= f"../{app}"
    for i in range(max_depth):
        print(f"Trying ... {upapp}!")
        if ( os.path.exists(upapp) and os.path.exists(f"{upapp}/application_context/") ):
            print("\tGot it")
            return upapp
        upapp = f"../{upapp}"
    return ""

''' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MAIN
'''
print("==== Activate ====")
DEFAULT_APP = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('DEFAULT_APP', "")

AP1="application_context"

if ( not DEFAULT_APP and os.path.exists(AP1) ):
    DEFAULT_APP= os.path.basename(os.path.dirname(os.path.realpath(AP1)))
    if (os.path.exists(f"{DEFAULT_APP}/env")):
        load_dotenv(f"{DEFAULT_APP}/env")
if ( not DEFAULT_APP):
    print("DEFALT APP is null, setting example app")
    load_dotenv("example_app/env")
    DEFAULT_APP = os.environ['DEFAULT_APP'] or sys.argv[1]
elif (not os.environ.get( 'PORT', "")):
    if (os.path.exists(f"{DEFAULT_APP}/env")):
        load_dotenv(f"{DEFAULT_APP}/env")
    
print (f'''
This script will set up environments as expected by your default environment setting.
Current environment settings are:

    DEFAULT_APP: {DEFAULT_APP}
           PORT: {os.environ.get( 'PORT', "8000")}
''')

AP2=f"{DEFAULT_APP}/application_context"

if (os.path.exists(AP1) and os.path.exists(AP2) and os.path.samefile(AP1, AP2) ):
    print(f"\nGOOD: {AP1} matches {AP2} it looks good; remove link 'application_context' to force \n")
    sys.exit(0)

if ( os.path.islink(DEFAULT_APP)):
    LINK_APP = os.path.realpath(DEFAULT_APP)
    print(f"DEFAULT app is link: {LINK_APP}")
else:
    os.system("make clean")
    LINK_APP = searchfor(DEFAULT_APP, max_depth=2)
    if (not LINK_APP ):
        print(f"Error: Could not locate '{DEFAULT_APP}'! searched in current and 2 directories above! exiting..")
        sys.exit(1)


print(f"\n!!Links '{AP1}' and '{AP2}' are different..resetting\n")

os.system("make clean")
if (LINK_APP): 
    print(f"Creating link to  {LINK_APP}")
    os.system(f"ln -s {LINK_APP}")
    if (os.path.exists(f"{LINK_APP}/env")):
        load_dotenv(f"{LINK_APP}/env")

print(f"Creating link to  {AP2}")
os.system(f'ln -s {AP2}')

DEF_DIR  = os.path.dirname(LINK_APP)
LINK_APPS= os.environ.get("LINK_APPS", "")
print(f"Checking dependent apps  {LINK_APPS}")
for l in LINK_APPS.split():
    ll = f"{DEF_DIR}/{l}"
    if ( os.path.exists(ll)):
        print(f"Linking {ll}")
        os.system(f"ln -s {ll}")
    else:
        print(f"Path not found: => {ll} !!")

print("All done!\nYou can run your app by calling\n\t make run DEFAULT_APP={DEFAULT_APP}")
