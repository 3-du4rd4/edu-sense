from fastapi import APIRouter, Query

from schemas.dashboard import (
    DashboardCalendarResponse,
    DashboardResponse,
)
from services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard(userId: str = Query(...)):
    service = DashboardService()

    return await service.get_dashboard(user_id=userId)


@router.get("/calendar", response_model=DashboardCalendarResponse)
async def get_dashboard_calendar(
    userId: str = Query(...),
    month: str = Query(...),
):
    service = DashboardService()

    return await service.get_calendar(
        user_id=userId,
        month=month,
    )