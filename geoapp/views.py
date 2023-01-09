from django.shortcuts import render
import apps.settings

APPNAME   ='geoapp'

# -----------------------------------------------------------------------
def index(request):
    try:
        def_app = apps.settings.DEFAULT_APP
    except:
        print("No default app - using index.html")
        def_app = None
        
    if (not def_app ):
        return render(request, 'index.html')
        
    #app = f'{apps.settings.DEFAULT_APP}'
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

            context = {
                "current_site": current_site,
                "user": user,
                "password_reset_url": url,
                "password_reset_url1": url1,
                "request": request,
            }

            get_adapter(request).send_mail(
                "account/email/password_reset_key", email, context
            )
        return self.cleaned_data["email"]
        
class myPasswordResetView(PasswordResetView):
    form_class = MyResetPasswordForm

allauth.account.views.password_reset = myPasswordResetView.as_view()
print( f"===> {allauth.account.views.password_reset}")

# -----------------------------------------------------------------------
