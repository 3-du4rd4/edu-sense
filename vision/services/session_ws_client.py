import asyncio
import json

import websockets


class SessionWebSocketClient:
    def __init__(self, url: str):
        self.url = url


    async def listen(self, on_event):
        while True:
            try:
                print(f"Connecting to backend websocket: {self.url}")

                async with websockets.connect(self.url) as websocket:
                    print("Connected to backend websocket")

                    async for raw_message in websocket:
                        message = json.loads(raw_message)

                        event = message.get("event")
                        payload = message.get("payload")

                        if not event:
                            continue

                        await on_event(event, payload)

            except Exception as e:
                print(f"WebSocket connection error: {e}")
                print("Retrying in 5 seconds...")

                await asyncio.sleep(5)
