from collections import defaultdict
from typing import Any

from fastapi import WebSocket
from fastapi.encoders import jsonable_encoder


class WebSocketManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)


    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id].append(websocket)
        print(f"WebSocket connected: {user_id}")
        print(f"Active connections: {list(self.active_connections.keys())}")


    def disconnect(self, websocket: WebSocket, user_id: str):
        connections = self.active_connections.get(user_id)

        if not connections:
            return
        
        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            self.active_connections.pop(user_id, None)


    async def send_to_user(self, user_id: str, event: str, payload: dict[str, Any]):
        connections = self.active_connections.get(user_id, [])

        print(f"Sending event '{event}' to user: {user_id}")
        print(f"Connections found: {len(connections)}")

        message = {
            "event": event,
            "payload": payload
        }

        disconnected = []

        for connection in connections:
            try:
                await connection.send_json(jsonable_encoder(message))
            except Exception as error:
                print(f"Error sending websocket message: {error}")
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(connection, user_id)

        
    async def broadcast(self, event: str, payload: dict[str, Any]):
        for user_id in list(self.active_connections.keys()):
            await self.send_to_user(user_id, event, payload)


websocket_manager = WebSocketManager()