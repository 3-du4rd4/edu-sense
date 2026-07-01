from fastapi import APIRouter

from app.schemas.performance_metrics import (
    PerformanceMetricsRequest,
    PerformanceMetricsResponse,
)
from app.services.performance_metrics_service import PerformanceMetricsService

router = APIRouter(prefix="/performance-metrics", tags=["Performance Metrics"])


@router.post("", response_model=PerformanceMetricsResponse)
async def create_performance_metric(data: PerformanceMetricsRequest):
    service = PerformanceMetricsService()
    
    return await service.create_metric(data=data)
