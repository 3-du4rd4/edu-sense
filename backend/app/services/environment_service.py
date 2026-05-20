from datetime import datetime, timezone

from repositories.environment_repository import EnvironmentRepository
from repositories.session_repository import SessionRepository
from schemas.environment import EnvironmentPayload
from websocket.events import WebSocketEvent
from websocket.manager import websocket_manager


class EnvironmentService:
    def __init__(self):
        self.environment_repository = EnvironmentRepository()
        self.session_repository = SessionRepository()

    
    async def process_environment_reading(
        self,
        user_id: str,
        payload: EnvironmentPayload
    ) -> dict | None:
        active_session = await self.session_repository.get_active_session_by_user_id(user_id)

        if not active_session:
            print(f"No active session found for user_id: {user_id}")
            return None
        
        reading_data = {
            "sessionId": active_session["_id"],
            "temperature": payload.temperature,
            "noise": payload.noise,
            "light": payload.light,
            "timestamp": datetime.now(timezone.utc)
        }

        created_reading = await self.environment_repository.create_reading(reading_data)

        await websocket_manager.send_to_user(
            user_id=user_id,
            event=WebSocketEvent.ENVIRONMENT_UPDATE,
            payload=created_reading
        )

        return created_reading