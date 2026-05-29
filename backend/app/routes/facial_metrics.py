from fastapi import APIRouter

from schemas.facial_metrics import (
    FacialMetricsRequest,
    FacialMetricsResponse,
)
from services.facial_metrics_service import FacialMetricsService

router = APIRouter(prefix="/facial-metrics", tags=["Facial Metrics"])


@router.post("", response_model=FacialMetricsResponse)
async def create_facial_metric(data: FacialMetricsRequest):
    service = FacialMetricsService()
    
    return await service.create_metric(data=data)