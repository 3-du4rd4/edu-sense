from datetime import datetime
from pydantic import BaseModel, Field


class FacialFeatures(BaseModel):
    earMean: float | None = None
    earMin: float | None = None
    earStd: float | None = None
    marMean: float | None = None
    marMax: float | None = None
    marStd: float | None = None
    perclose: float | None = None
    eyesClosedRatio: float | None = None
    yawnCount: int | None = None


class FacialMetricsRequest(BaseModel):
    userId: str
    ear: float
    mar: float
    eyesClosed: bool
    yawning: bool
    features: FacialFeatures | None = None


class FacialMetricsResponse(BaseModel):
    id: str = Field(..., alias="_id")
    sessionId: str
    ear: float
    mar: float
    eyesClosed: bool
    yawning: bool
    timestamp: datetime
    features: FacialFeatures | None = None

    model_config = {
        "populate_by_name": True
    }