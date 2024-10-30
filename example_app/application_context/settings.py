DEFAULT_APP = "example_app"

'''
You can include this in your html pages and refer to these variables:
For example:

	{{ appname }}

'''
import geoapp.analytics as analytics
#---------------------------------------------------------------------------------
def appcontext(request):
    context = {
        "appname": "ExAmPlE",
        "weburl" : "https://www.lmco.org/",
        "top_url": "example_app/topbar.html",
        "NO_LOGIN_MENU": 0,
		"SSO": 1,
        "DO_NOT_SHOW_LOGIN" : 1,
        "APP_MENU" : 1,
		"ALLOW_REGISTRATION": 0,
    }    
    analytics.loganalytics(request);
    
    return context
