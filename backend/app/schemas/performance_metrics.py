from pydantic import BaseModel, Field
from typing import Literal


class PerformanceMetricsRequest(BaseModel):
    sessionId: str
    type: Literal["environment", "facial"]
    receivedAt: str | None = None
    requestTimestamp: str | None = None

class PerformanceMetricsResponse(BaseModel):
    id: str = Field(..., alias="_id")
    sessionId: str
    type: Literal["environment", "facial"]
    receivedAt: str | None = None
    requestTimestamp: str | None = None

    model_config = {
        "populate_by_name": True
    }