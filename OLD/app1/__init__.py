import os

print ("Initializing app1 folder: " + os.getcwd())
if (os.path.exists("app1/services.py")):
    from . import services
else:
    print("Services file does not exist")
    
