import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.urls import re_path

# -----------------------------------------------------------------------
class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

    def connect(self):
        self.accept()
    def disconnect(self, close_code):
        pass
    def receive(self, text_data):
        print( "+++++ Received ", text_data)

        self.send(text_data= "Hello: " + text_data)

# -----------------------------------------------------------------------
from channels.generic.websocket import AsyncWebsocketConsumer
class GeoAsyncConsumer(WebsocketConsumer):
    def __init__(self,group="geo", *args, **kwargs):
        super().__init__(args, kwargs)
        self.group   = group

    def connect(self):
        self.group = self.scope['url_route']['kwargs']['room_name']
        self.user = self.scope['user']

        self.accept()
        async_to_sync(self.channel_layer.group_add)(self.group, self.channel_name) 
        print(f"++++++ ADDED a client :) {self.group}:{self.channel_name}")

        sendOnConnect = 0
        if (sendOnConnect):
            async_to_sync(self.channel_layer.group_send)(
                self.group,
                {
                    'type': 'handle_message',
                    'message': f"From {self.user.username}\n\n Userjoined: "
                }
            )


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group, self.channel_name    )
        print("----- client diconnected!")



    def receive(self, text_data):
        print(f"~~~~~~ MESSAGE ! {text_data[0:128]}")
        if ( text_data.startswith("@all:")):
            self.groupsend("Hello: " + text_data)
        #self.send(text_data = "Sent: " + text_data)

    def groupsend(self, message):
        self.user = self.scope['user']

        print(f"++++++ Send to all => {self.group}:{self.channel_name}")
        msg = {
            'type': 'handle_message',
            'message':  f"From: {self.user.username}\n\n" + message
        }
        async_to_sync(self.channel_layer.group_send)(self.group, msg)

    def handle_message(self, event):
        self.send(text_data=json.dumps(event))
# -----------------------------------------------------------------------
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def broadcast(request, requireUser=False):
    from django.http import HttpResponse

    if requireUser and not request.user.is_authenticated:
        print("?: User not authenticated")
        return  HttpResponse("?: User not authenticated")

    user = request.user.username
    par = dict(request.GET)
    par.update(request.POST)
    room = par.get("room", ['general'])[0]
    if ( not room):
        print("No room name given")
        return HttpResponse("No room")

    message = par.get( 'message', [""])[0]
    message = f"From: {user}\n\nTo: {room}\n\n{str(message)}"

    print(message)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        room,
        {'type': 'handle_message', 'message': message}
    )
    return HttpResponse(f"OK Message:{message}")
# -----------------------------------------------------------------------
websocket_urlpatterns = [
    #re_path(r'ws/chat/1/$', ChatConsumer.as_asgi()),
    #re_path(r'ws/chat/2/$', GeoAsyncConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', GeoAsyncConsumer.as_asgi()),
]
