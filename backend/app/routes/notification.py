from fastapi import APIRouter, Depends, Query

from dependencies.auth import get_current_user
from schemas.notification import NotificationResponse
from services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=list[NotificationResponse])
async def list_notifications(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    service = NotificationService()

    return await service.list_user_notifications(
        user_id=current_user["_id"],
        limit=limit,
    )


@router.patch("/read-all")
async def mark_all_notifications_as_read(
    current_user: dict = Depends(get_current_user),
):
    service = NotificationService()

    await service.mark_all_as_read(user_id=current_user["_id"])

    return {"message": "Notifications marked as read"}


@router.patch("/{notification_id}/read", response_model=NotificationResponse | None)
async def mark_notification_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    service = NotificationService()

    return await service.mark_as_read(
        notification_id=notification_id,
        user_id=current_user["_id"],
    )
