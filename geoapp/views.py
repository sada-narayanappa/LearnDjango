from django.http import HttpResponse
from django.shortcuts import render
import apps, json, datetime, geoapp, geoapp.utils, logging
import apps.settings
from mangorest import mango

APPNAME   ='geoapp'
#------------------------------------------------------------------------------
'''import logging
logging.basicConfig( level=logging.INFO,
        format='%(levelname)s:%(name)s %(asctime)s %(filename)s:%(lineno)s:%(funcName)s: %(message)s',
        handlers=[ logging.FileHandler("/tmp/app.log"), logging.StreamHandler()],
        #handlers=[ logging.StreamHandler()],
)
'''
logger = logging.getLogger("geoapp")

# -----------------------------------------------------------------------
def index(request):
    try:
        def_app = apps.settings.DEFAULT_APP
    except Exception as e:
        logger.exception(e)
        logger.error("No default app - using index.html {e}")
        def_app = None
        
    if (not def_app ):
        return render(request, 'index.html')
        
    template = f'{def_app}/index.html/'
    
    return render(request, template )

# -----------------------------------------------------------------------
def uploadfile(request):
    par = dict(request.GET)
    par.update(request.POST)

    savedir =  par.get("savedir", "/");
    if not savedir.endswith("/") or not savedir.endswith("\\"):
        savedir += "/"
    
    ret = "Uploading Files:\n "
    for f in request.FILES.getlist('file'):
        content = f.read()
        filename = f"/tmp/{savedir}/{str(f)}"
        print(f"++ Save file {filename} Content: {len(content)} :")
        with open(filename, "wb") as f:
            f.write(content)
        ret += filename + "\n"


    return HttpResponse(ret)

# -----------------------------------------------------------------------
def contactusemail(name="", email="", phone="", msg="", **kwargs):
    sub= "Thank you for reaching out."
    ret = f'''
Dear {name},

{sub}

We will review your message and get back at the contact information you provided.

Best Regards,
Admin


C O N T A C T   I N F O R M A T I O N  & M E S S A G E:
-------------------------------------------------------

Name : {name}
Email: {email}
Phone: {phone}
Message:
{msg}
'''
    geoapp.utils.demail(subject=sub, msg=ret, to=email, dfrom="admin@megadatasys.com")
    return ret

def contactus(request):
    parms = mango.getparms(request)

    ret = contactusemail(**parms)
    return HttpResponse(ret)


# -----------------------------------------------------------------------
import allauth.account.views
import allauth.account.forms
from   allauth.account.forms import ResetPasswordForm
from   allauth.account.views import PasswordResetView

from allauth.account.utils import (filter_users_by_email, user_pk_to_url_str, user_username)
from allauth.utils import build_absolute_uri
from allauth.account.adapter import get_adapter
from allauth.account.forms import default_token_generator
from allauth.account import app_settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse, reverse_lazy

from django.conf import settings

class MyResetPasswordForm(ResetPasswordForm):
    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data["email"]
        token_generator = kwargs.get("token_generator", default_token_generator)

        for user in self.users:

            temp_key = token_generator.make_token(user)

            # save it to the password reset model
            # password_reset = PasswordReset(user=user, temp_key=temp_key)
            # password_reset.save()

            # send the password reset email
            path = reverse(
                "account_reset_password_from_key",
                kwargs=dict(uidb36=user_pk_to_url_str(user), key=temp_key),
            )
            url = build_absolute_uri(request, path)
            url1 = request.POST.get("DOMAIN") + path
            url1 = settings.DEFAULT_DOMAIN + path

            context = {
                "current_site": current_site,
                "user": user,
                "password_reset_url": url,
                "password_reset_url1": url1,
                "request": request,
                "domain": settings.DEFAULT_DOMAIN
            }

            print(f"===> {context}")
            get_adapter(request).send_mail(
                "account/email/password_reset_key", email, context
            )
        return self.cleaned_data["email"]
        
class myPasswordResetView(PasswordResetView):
    form_class = MyResetPasswordForm

allauth.account.views.password_reset = myPasswordResetView.as_view()
print( f"===> {allauth.account.views.password_reset}")

# -----------------------------------------------------------------------
from django.contrib.auth.signals import user_logged_in
def postLoggedIn(sender, user, request, **kwargs):
    if ( not request.path_info.startswith("/oidc/") ):
        return
    print(f'''***OIDC username: {user.username}, email: {user.email} ***''')
    if ( not user.email.startswith(user.username)):
        print("******** UPDATING USERNAME")
        user.username=user.email.split("@")[0]
        user.save()
    
user_logged_in.connect(postLoggedIn)
