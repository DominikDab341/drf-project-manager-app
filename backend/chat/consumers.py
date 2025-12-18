import json
from channels.generic.websocket import AsyncWebsocketConsumer


WS_CLOSE_AUTH_FAILED = 4003

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user:
            await self.close(code=WS_CLOSE_AUTH_FAILED)
            return
        self.project_id = self.scope["url_route"]["kwargs"]["project_id"]
        self.room_group_name = f"chat_{self.project_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "").strip()
        if not message:
            return

        user = self.scope["user"]
        if not user:
            await self.close(code=WS_CLOSE_AUTH_FAILED)
            return

        username = user.username  

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"],
        }))