from datetime import datetime, timedelta, timezone

from repositories.notification_repository import NotificationRepository
from websocket.events import WebSocketEvent
from websocket.manager import websocket_manager


NOTIFICATION_COOLDOWN_SECONDS = 120


class NotificationService:
    def __init__(self):
        self.repository = NotificationRepository()


    async def create_if_allowed(
        self,
        *,
        user_id: str,
        session_id: str,
        type: str,
        severity: str,
        source: str,
        title: str,
        message: str,
        value: float | bool,
        threshold: float | bool | None = None,
    ) -> dict | None:
        latest_notification = await self.repository.get_latest_by_source(
            user_id=user_id,
            session_id=session_id,
            source=source,
        )

        if latest_notification and self._is_inside_cooldown(
            latest_notification["createdAt"]
        ):
            return None

        notification_data = {
            "userId": user_id,
            "sessionId": session_id,
            "type": type,
            "severity": severity,
            "source": source,
            "title": title,
            "message": message,
            "value": value,
            "threshold": threshold,
            "read": False,
            "createdAt": datetime.now(timezone.utc),
        }

        notification = await self.repository.create_notification(notification_data)

        await websocket_manager.send_to_user(
            user_id=user_id,
            event=WebSocketEvent.NOTIFICATION_CREATED,
            payload=notification,
        )

        return notification


    async def list_user_notifications(
        self,
        user_id: str,
        limit: int = 20,
    ) -> list[dict]:
        return await self.repository.list_by_user(
            user_id=user_id,
            limit=limit,
        )


    async def mark_as_read(
        self,
        notification_id: str,
        user_id: str,
    ) -> dict | None:
        return await self.repository.mark_as_read(
            notification_id=notification_id,
            user_id=user_id,
        )


    async def mark_all_as_read(self, user_id: str) -> None:
        await self.repository.mark_all_as_read(user_id)


    def _is_inside_cooldown(self, created_at: datetime) -> bool:
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        elapsed = datetime.now(timezone.utc) - created_at

        return elapsed < timedelta(seconds=NOTIFICATION_COOLDOWN_SECONDS)