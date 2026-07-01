from fastapi import APIRouter

from app.schemas.facial_metrics import (
    FacialMetricsRequest,
    FacialMetricsResponse,
)
from app.services.facial_metrics_service import FacialMetricsService

router = APIRouter(prefix="/facial-metrics", tags=["Facial Metrics"])


@router.post("", response_model=FacialMetricsResponse)
async def create_facial_metric(data: FacialMetricsRequest):
    service = FacialMetricsService()
    
    return await service.create_metric(data=data)


@router.get(
    "/session/{session_id}/latest", 
    response_model=FacialMetricsResponse | None
)
async def get_latest_facial_metric(session_id: str):
    service = FacialMetricsService()
    
    return await service.get_latest_metric_by_session(session_id=session_id)