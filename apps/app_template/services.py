#!/usr/local/bin/python 

#*** DO NOT EDIT - GENERATED FROM services.ipynb ****

from  mangorest.mango import webapi
#--------------------------------------------------------------------------------------------------------    
@webapi("/app2/test")
def test( **kwargs):
    ret = "APP 2 TEST version 1.0 " + str(kwargs)
    print( "+++++ ret ", ret)
    return ret;
#--------------------------------------------------------------------------------------------------------    
#--------------------------------------------------------------------------------------------------------    
@webapi("/app2/test1")
def test1( name = "No name", **kwargs):
    ret = "Name: " + name
    return ret;
