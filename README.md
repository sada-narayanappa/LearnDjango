# Application Template 1

## Basic setup

* Link tseries directory to /opt/data/tseries
> ln -s /opt/LMCO/git/notebooks/DS/tseries/db/ /opt/data/tseries/db
# Using Django framework in your application

This is a application framework that use python Django-framework. 
This framework is created to quickly prototype web applications and show some good practices.

This framework is built to quickly develop web applications and shoul not be used for commercial applications.  I created this to quickly and easily build applications to show the proof of concept. 

You can start the application in few minutes and start bulilding applications.
This is to be used only for educational purpose and not suited for commercial application.

If you want to use it to deploy commercial applications, please contact the author.


## Intallation
```{}
# Option to create a venv 

python -m venv ~/venv/ldtest
alias pyld='source ~/venv/ldtest/bin/activate'
pyld
```

Run the following commands
```
git clone https://github.com/sada-narayanappa/LearnDjango.git
cd LearnDjango
pip install -r requirements.txt
make run
```

If everything works as expected, navigate to http://localhost:8003


Now develop your applications either modifying or creating new applications.
see the videos and other documentations below.

### Youtube Video playlist:

https://youtube.com/playlist?list=PLEpvS3HCVQ58at6W2qxGoH8rWBTfNrq99

#
## Advanced setup

You must create a ~/.myconfig with collowing contents - 
replace with meaningful values:

```
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.yourdomain.com'
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = 'yourusername'
EMAIL_HOST_USER = 'yourhost'
EMAIL_HOST_PASSWORD = 'password$'
SECRET_KEY="yoursecret key"
ENV='local|production'
STRIPE_PUBLIC_TEST='A'
STRIPE_SECRET_TEST='A'
STRIPE_PUBLIC_LIVE='B'
STRIPE_SECRET_LIVE='B'
STRIPE_PUBLIC = STRIPE_PUBLIC_LIVE
STRIPE_SECRET = STRIPE_SECRET_LIVE
CAPTCHA_SITE   = 'key'
CAPTCHA_SECRET = 'key'

EXP_STRIPE_PUBLIC = STRIPE_PUBLIC_TEST
EXP_STRIPE_SECRET = STRIPE_SECRET_TEST

# -- SIngle Sign on below
OIDC_RP_CLIENT_ID = 'your-oauth'
OIDC_RP_CLIENT_SECRET = 'jkSIDbfvK7WFkyeSEEbB91Nk0vZf5uJl2aRnkuVy'
OIDC_OP_AUTHORIZATION_ENDPOINT = 'auth_endpoint'
OIDC_OP_TOKEN_ENDPOINT = 'token_endpoint'
OIDC_OP_USER_ENDPOINT = 'user_endpoint'
OIDC_RP_SIGN_ALGO = 'RS256'
OIDC_OP_JWKS_ENDPOINT = 'jwks'
OIDC_RP_SCOPES = "openid profile email"
OIDC_RENEW_ID_TOKEN_EXPIRY_SECONDS = 15

OIDC_CREATE_USER = True
OIDC_VERIFY_SSL = True
```

---

# TO create app 

Make a copy of example_app
```
    cp -R example_app myapp
    mv myapp ..
    ln -s ../myapp .
    #save your my app to git and manage it
```

Now when you run it my_app will be included automatically

1. edit myapp/env and adjust the port etc.
2. edit myapp/application_context/settings.py to adjust the settings for your app

when you source myapp/env and run 'make run' - application will automatically 
setup the environments to your application

