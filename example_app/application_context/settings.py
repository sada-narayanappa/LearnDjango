'''
You can include this in your html pages and refer to these variables:
For example:

	{{ appname }}

'''
#---------------------------------------------------------------------------------
DEFAULT_APP = "example_app"
import geoapp.analytics as analytics
#---------------------------------------------------------------------------------
def appcontext(request):
    context = {
        "appname"           : "ExAmPlE",
        "weburl"            : "https://www.lmco.org/",
        "top_url"           : "example_app/topbar.html",
        "NO_LOGIN_MENU"     : 0,        # 1: to show login menu in topbar right corner
        "APP_MENU"          : 1,        # 1: show applications menu in top bar
        
		"SSO"               : 0,        # 1: to show single signon during login
        "DO_NOT_SHOW_LOGIN" : 0,        # 1: do not allow users to enter username/passwd
		"ALLOW_REGISTRATION": 0,        # 1: allow users to register
    }    
    analytics.loganalytics(request);
    
    return context
#---------------------------------------------------------------------------------
