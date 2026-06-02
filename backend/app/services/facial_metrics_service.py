from datetime import datetime, timezone

from fastapi import HTTPException

from repositories.facial_metrics_repository import FacialMetricsRepository
from repositories.session_repository import SessionRepository
from schemas.facial_metrics import FacialMetricsRequest
from websocket.events import WebSocketEvent
from websocket.manager import websocket_manager


class FacialMetricsService:
    def __init__(self):
        self.repository = FacialMetricsRepository()
        self.session_repository = SessionRepository()


    async def create_metric(self, data: FacialMetricsRequest) -> dict:
        active_session = await self.session_repository.get_active_session_by_user_id(
            data.userId
        )

        if not active_session:
            raise HTTPException(
                status_code=404, 
                detail="No active session found for the user"
            )

        metric_data = {
            "sessionId": active_session["_id"],
            "ear": data.ear,
            "mar": data.mar,
            "eyesClosed": data.eyesClosed,
            "yawning": data.yawning,
            "timestamp": datetime.now(timezone.utc)
        }

        created_metric = await self.repository.create_metric(metric_data)

        await websocket_manager.send_to_user(
            user_id=data.userId,
            event=WebSocketEvent.FACIAL_METRICS_UPDATE,
            payload=created_metric
        )

        return created_metric


    async def get_latest_metric_by_session(
        self, 
        session_id: str
    ) -> dict | None:
        return await self.repository.get_latest_metric_by_session(session_id)