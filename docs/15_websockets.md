# Websockets

This document shows how to send asynchrinous messages to web application.
see the example in: https://github.com/testdrivenio/django-channels-example

See the files added here:

geoapp/views_channel => handles messages at the server

geoapp/settings.py

    INSTALLED_APPS += ['channels']
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        },
    }
geoapp.asgi.py

    from channels.auth import AuthMiddlewareStack
    from channels.routing import ProtocolTypeRouter, URLRouter
    import geoapp.views_channels

    application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
            URLRouter(
                geoapp.views_channels.websocket_urlpatterns
            )
        ),
    })

Make sure to check the apache config files in 'cd /etc/apache2/sites-available; vi proxy.conf '

NOTE you must run asgi application wagi.sh (not wsgi.sh)

uvicorn --host 0.0.0.0  --port ${PORT}  geoapp.asgi:application --reload
On the client side in

templates/common.html:

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let GEO_SOCKET;
    function setSocket() {
        GEO_SOCKET = new WebSocket('ws://'+ window.location.host + '/ws/chat/2/');

        GEO_SOCKET.onmessage = function(e) {   // Handle incoming message
            console.log(e.data)
        };
    }
    function sendSocket(message="Connect me: channel") {
        if ( !GEO_SOCKET) 
            return
        try{
            GEO_SOCKET.send(message);
        } catch {
            GEO_SOCKET = null;
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).ready(function() {
        doClassbasedInit()
        setSocket()
    })


## Details of mechanics of how it works

    Code goes in here
    Interesting I did not know this trick

