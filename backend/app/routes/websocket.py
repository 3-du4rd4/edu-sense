from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from websocket.manager import websocket_manager

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket_manager.connect(websocket, user_id)

    try:
        while True:
            await websocket.receive_text()
            
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, user_id)