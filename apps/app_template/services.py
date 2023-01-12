#!/usr/local/bin/python 

#*** DO NOT EDIT - GENERATED FROM services.ipynb ****

from  mangorest.mango import webapi
#--------------------------------------------------------------------------------------------------------    
@webapi("/app_template/test")
def test( request,  **kwargs):
    return "APP 1 TEST version 1.0"
#--------------------------------------------------------------------------------------------------------    
