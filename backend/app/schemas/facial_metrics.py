from datetime import datetime
from pydantic import BaseModel, Field


class FacialMetricsRequest(BaseModel):
    userId: str
    ear: float
    mar: float
    eyesClosed: bool
    yawning: bool


class FacialMetricsResponse(BaseModel):
    id: str = Field(..., alias="_id")
    sessionId: str
    ear: float
    mar: float
    eyesClosed: bool
    yawning: bool
    timestamp: datetime

    model_config = {
        "populate_by_name": True
    }