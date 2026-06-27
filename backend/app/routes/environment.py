from fastapi import APIRouter

from schemas.environment import (
    EnvironmentReadingRequest,
    EnvironmentReadingResponse,
)
from services.environment_service import EnvironmentService

router = APIRouter(prefix="/environment-readings", tags=["Environment Readings"])


@router.post("", response_model=EnvironmentReadingResponse)
async def create_environment_reading(data: EnvironmentReadingRequest):
    service = EnvironmentService()

    return await service.process_environment_reading(data)


@router.get(
    "/session/{session_id}/latest",
    response_model=EnvironmentReadingResponse | None,
)
async def get_latest_environment_reading(session_id: str):
    service = EnvironmentService()

    return await service.get_latest_reading_by_session(session_id)