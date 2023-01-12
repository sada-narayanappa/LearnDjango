import os

# You may use the following template to call to initialize any modules
#
# print ("Initializing this file folder: " + os.getcwd())
#
# Do some checks and finish your initializations
# 
if (os.path.exists("services.py")):
     from . import services
    