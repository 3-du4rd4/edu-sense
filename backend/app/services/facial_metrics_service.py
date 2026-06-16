from datetime import datetime, timezone

from fastapi import HTTPException

from repositories.facial_metrics_repository import FacialMetricsRepository
from repositories.session_repository import SessionRepository
from schemas.facial_metrics import FacialMetricsRequest
from websocket.events import WebSocketEvent
from websocket.manager import websocket_manager
from services.notification_service import NotificationService


class FacialMetricsService:
    def __init__(self):
        self.repository = FacialMetricsRepository()
        self.session_repository = SessionRepository()
        self.notification_service = NotificationService()


    async def create_metric(self, data: FacialMetricsRequest) -> dict:
        active_session = await self.session_repository.get_by_id(data.sessionId)

        if not active_session:
            raise HTTPException(
                status_code=404, 
                detail="No active session found for the user"
            )

        metric_data = {
            "sessionId": data.sessionId,
            "ear": data.ear,
            "mar": data.mar,
            "eyesClosed": data.eyesClosed,
            "yawning": data.yawning,
            "timestamp": data.timestamp or datetime.now(timezone.utc),
            "features": data.features.model_dump() if data.features else None
        }

        created_metric = await self.repository.create_metric(metric_data)

        await websocket_manager.send_to_user(
            user_id=data.userId,
            event=WebSocketEvent.FACIAL_METRICS_UPDATE,
            payload=created_metric
        )

        await self._check_facial_notifications(
            user_id=data.userId,
            session_id=created_metric["sessionId"],
            eyes_closed=created_metric["eyesClosed"],
            yawning=created_metric["yawning"],
        )

        return created_metric


    async def get_latest_metric_by_session(
        self, 
        session_id: str
    ) -> dict | None:
        return await self.repository.get_latest_metric_by_session(session_id)
    

    async def _check_facial_notifications(
        self,
        user_id: str,
        session_id: str,
        eyes_closed: bool,
        yawning: bool,
    ) -> None:
        if eyes_closed:
            await self.notification_service.create_if_allowed(
                user_id=user_id,
                session_id=session_id,
                type="facial",
                severity="warning",
                source="eyesClosed",
                title="Eyes closed detected",
                message="You seem to be closing your eyes. Consider taking a short break.",
                value=eyes_closed,
                threshold=True,
            )

        if yawning:
            await self.notification_service.create_if_allowed(
                user_id=user_id,
                session_id=session_id,
                type="facial",
                severity="warning",
                source="yawning",
                title="Yawning detected",
                message="Signs of tiredness were detected. A short pause may help you recover focus.",
                value=yawning,
                threshold=True,
            )