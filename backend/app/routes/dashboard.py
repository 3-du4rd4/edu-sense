from fastapi import APIRouter, Query, Depends

from dependencies.auth import get_current_user

from schemas.dashboard import (
    DashboardCalendarResponse,
    DashboardResponse,
)
    
from services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    current_user: dict = Depends(get_current_user)
):
    service = DashboardService()

    return await service.get_dashboard(user_id=current_user["_id"])


@router.get("/calendar", response_model=DashboardCalendarResponse)
async def get_dashboard_calendar(
    current_user: dict = Depends(get_current_user),
    month: str = Query(...),
):
    service = DashboardService()

    return await service.get_calendar(
        user_id=current_user["_id"],
        month=month,
    )