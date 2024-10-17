# Application Template 1

## Basic setup

* Link tseries directory to /opt/data/tseries
> ln -s /opt/LMCO/git/notebooks/DS/tseries/db/ /opt/data/tseries/db

You must create a ~/.myconfig with collowing contents - 
replace with meaningful results:

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
---

## To install new application

assume you are adding application named 'mvideo' 

* geoapp/settings.py
- Add a line to 'INSTALLED_APPS'
>> INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    ...
    'mvideo'
    ]

* geoapp/urls.py - add the following line 
    path('mvideo/',   include('mvideo.urls'),   name="mvideo"),
