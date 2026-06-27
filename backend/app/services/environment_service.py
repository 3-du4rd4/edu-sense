from datetime import datetime, timezone

from app.repositories.environment_repository import EnvironmentRepository
from app.repositories.session_repository import SessionRepository
from app.schemas.environment import EnvironmentReadingRequest
from app.websocket.events import WebSocketEvent
from app.websocket.manager import websocket_manager
from app.services.notification_service import NotificationService


class EnvironmentService:
    def __init__(self):
        self.environment_repository = EnvironmentRepository()
        self.session_repository = SessionRepository()
        self.notification_service = NotificationService()

    
    async def process_environment_reading(
        self,
        data: EnvironmentReadingRequest,
    ) -> dict | None:
        active_session = await self.session_repository.get_active_session()

        if not active_session:
            print(f"No active session found")
            return None
        
        reading_data = {
            "sessionId": active_session["_id"],
            "temperature": data.temperature,
            "noise": data.noise,
            "light": data.light,
            "timestamp": datetime.now(timezone.utc)
        }

        created_reading = await self.environment_repository.create_reading(reading_data)

        await websocket_manager.send_to_user(
            user_id=active_session["userId"],
            event=WebSocketEvent.ENVIRONMENT_UPDATE,
            payload=created_reading
        )

        await self._check_environment_notifications(
            user_id=active_session["userId"],
            session_id=created_reading["sessionId"],
            temperature=created_reading["temperature"],
            noise=created_reading["noise"],
            light=created_reading["light"]
        )

        return created_reading
    

    async def get_latest_reading_by_session(
        self,
        session_id: str
    ) -> dict | None:
        return await self.environment_repository.get_latest_reading_by_session(
            session_id=session_id
        )
    

    async def _check_environment_notifications(
        self,
        user_id: str,
        session_id: str,
        temperature: float,
        light: float,
        noise: float,
    ) -> None:
        if temperature > 30:
            await self.notification_service.create_if_allowed(
                user_id=user_id,
                session_id=session_id,
                type="environment",
                severity="warning",
                source="temperature",
                title="Temperatura alta",
                message="A temperatura da sala está acima do nível recomendado.",
                value=temperature,
                threshold=30,
            )

        if light > 900:
            await self.notification_service.create_if_allowed(
                user_id=user_id,
                session_id=session_id,
                type="environment",
                severity="warning",
                source="light",
                title="Nível de luz alto",
                message="O nível de luz está acima do intervalo recomendado.",
                value=light,
                threshold=900,
            )

        if noise > 65:
            await self.notification_service.create_if_allowed(
                user_id=user_id,
                session_id=session_id,
                type="environment",
                severity="warning",
                source="noise",
                title="Nível de ruído alto",
                message="O nível de ruído está acima do nível recomendado para estudo.",
                value=noise,
                threshold=65,
            )