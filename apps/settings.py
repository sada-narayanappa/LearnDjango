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
        "appname": "example",
        "weburl" : "http://localhost:8003/",
        "top_url": "example_app/topbar.html",
		"SSO": 1,
        "NO_LOGIN_MENU": 0,
        "NO_APP_MENU" : 1,
        "ALLOW_REGISTRATION": 0,
    }    
    analytics.loganalytics(request);
    
    return context
