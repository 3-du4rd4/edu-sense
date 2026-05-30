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