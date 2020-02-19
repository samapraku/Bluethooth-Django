from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

from bluedot import BlueDot

class BTConsumer(WebsocketConsumer):
    def connect(self):
        #   self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'bluetooth_group'
        #   % self.room_name
        self.bd = BlueDot()
        self.bd.when_pressed = self.dpad
        self.bd.when_moved = self.dpad

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def say_hello(self):
        self.send(text_data=json.dumps({
            'message': 'blue dot pressed.'
        }))

    def dpad(self,pos):
        if pos.top:
            self.send(text_data=json.dumps({
            'message': 'up'
            }))
        elif pos.bottom:
            self.send(text_data=json.dumps({
            'message': 'down'
            }))
        elif pos.left:
            self.send(text_data=json.dumps({
            'message': 'left'
            }))
        elif pos.right:
            self.send(text_data=json.dumps({
            'message': 'right'
            }))
        elif pos.middle:
            self.send(text_data=json.dumps({
            'message': 'fire'
            }))
