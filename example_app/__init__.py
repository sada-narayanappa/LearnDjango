import os

print ("Initializing example_app folder: " + os.getcwd())
if (os.path.exists("example_app/services.py")):
    from . import services
else:
    print("Services file does not exist")
    
