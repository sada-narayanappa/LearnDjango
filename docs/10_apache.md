# Apache installation and deployment

In this chapter you will learn how to install and configure apache to forward the requests

This chapter assumes that you have already installed apache.
You can go to apache configuration file.

```linenumber

    cd /etc/apache2
    /etc/apache2] ls -l
    total 80
    -rw-r--r-- 1 root root  7224 Jan  5  2022 apache2.conf
    drwxr-xr-x 2 root root  4096 Aug 30 20:58 conf-available/
    drwxr-xr-x 2 root root  4096 Aug 30 21:12 conf-enabled/
    -rw-r--r-- 1 root root  1782 Sep 30  2020 envvars
    -rw-r--r-- 1 root root 31063 Sep 30  2020 magic
    drwxr-xr-x 2 root root 12288 Aug 30 20:58 mods-available/
    drwxr-xr-x 2 root root  4096 Jun  6 15:00 mods-enabled/
    -rw-r--r-- 1 root root   320 Sep 30  2020 ports.conf
    drwxr-xr-x 2 root root  4096 Oct 30 16:22 sites-available/
    drwxr-xr-x 3 root root  4096 Sep  2  2023 sites-enabled/

```

go into sites-enabled folder and edit proxy.conf
Add the following lines to 

### EXAMPLE:
Here you are redirecting the url and asking apache to redirect to local 
port and send the results back.
When a request is made to "http://myapp.yourdomain.org" apache will send the request 
and act as a middle agent to transport information " http://localhost:8003/" and 

* Notice * when the url is 'http://edu.geospaces.org', it redirets to https.
Https service uses certificates obtained from 'https://letsencrypt.org/'
More about this later.



```
# File: /etc/apache2/sites-enabled/proxy.conf

<VirtualHost *:80>
    ServerName  yourdomain.org
    ServerAlias yourdomain.org
    DocumentRoot "/var/www/html"
    #Redirect / https://www.yourdomain.org/
</VirtualHost>

<VirtualHost *:80>
    ServerName 18.223.37.30
    ServerAlias 18.223.37.30
    DocumentRoot "/var/www/html"

    ProxyPass        / http://localhost:8888/
    ProxyPassReverse / http://localhost:8888/
</VirtualHost>

<VirtualHost *:80>
    ServerName  myapp.yourdomain.org
    ServerAlias myapp.yourdomain.org

    ProxyPass        / http://localhost:8003/
    ProxyPassReverse / http://localhost:8003/
</VirtualHost>


# CONFIGURE https - free certificate and enable audio service etc.
# Secure your server  
#
<VirtualHost *:80>
    ServerName  edu.geospaces.org
    ServerAlias edu.geospaces.org
    Redirect / https://edu.geospaces.org/
</VirtualHost>

<IfModule mod_ssl.c>

<VirtualHost *:443>
    ServerName edu.geospaces.org
    ProxyRequests Off
    <Proxy *>
        #Order deny,allow
        #Allow from all
    </Proxy>

    ProxyPass /ws/ ws://localhost:7004/ws/
    ProxyPassReverse /ws/ ws://localhost:7004/ws/

    ProxyPass        / http://localhost:7004/
    ProxyPassReverse / http://localhost:7004/

    <Location />
        Order allow,deny
        Allow from all
    </Location>
ServerAlias edu.geospaces.org
Include /etc/letsencrypt/options-ssl-apache.conf
SSLCertificateFile /etc/letsencrypt/live/edu.geospaces.org/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/edu.geospaces.org/privkey.pem
</VirtualHost>

</IfModule>

```

Make sure mod_sll is enabled in '/etc/apache2/mods-enabled' folder

```
# IN FOLDER: /etc/apache2/mods-enabled

/etc/apache2/mods-enabled] ls -l ssl.conf 
lrwxrwxrwx 1 root root 26 Mar  5  2022 ssl.conf -> ../mods-available/ssl.conf
lrwxrwxrwx 1 root root 28 Mar  5  2022 proxy.conf -> ../mods-available/proxy.conf
lrwxrwxrwx 1 root root 28 Mar  5  2022 proxy.load -> ../mods-available/proxy.load
```
----------------------------------------------------------------------------------------

