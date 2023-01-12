DEFAULT_APP = 'app1'

'''
You can include this in your html pages and refer to these variables:
For example:

	{{ appname }}

'''
#---------------------------------------------------------------------------------
def appcontext(request):
    context = {
        "appname": "YOUR APPLICATION",
        "weburl" : "https://www.geospaces.org/"
    }
    
    return context

