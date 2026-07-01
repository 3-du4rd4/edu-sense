from fastapi import HTTPException

from app.repositories.performance_metrics_repository import PerformanceMetricsRepository
from app.schemas.performance_metrics import PerformanceMetricsRequest
from app.repositories.session_repository import SessionRepository


class PerformanceMetricsService:
    def __init__(self):
        self.repository = PerformanceMetricsRepository()
        self.session_repository = SessionRepository()


    async def create_metric(self, data: PerformanceMetricsRequest) -> dict:
        active_session = await self.session_repository.get_by_id(data.sessionId)

        if not active_session:
            raise HTTPException(
                status_code=404, 
                detail="No active session found for the user"
            )

        metric_data = {
            "sessionId": data.sessionId,
            "type": data.type,
            "requestTimestamp": data.requestTimestamp,
            "receivedAt": data.receivedAt,
            "latency": data.latency
        }

        created_metric = await self.repository.create_metric(metric_data)

        return created_metric