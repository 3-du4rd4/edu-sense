from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EnvironmentPayload(BaseModel):
    temperature: float
    noise: float
    light: float
    requestTimestamp: str | None = None


class EnvironmentReadingRequest(BaseModel):
    temperature: float
    light: float
    noise: float
    requestTimestamp: str | None = None


class EnvironmentReadingResponse(BaseModel):
    _id: str
    sessionId: str
    temperature: float
    noise: float
    light: float
    requestTimestamp: str | None = None
    timestamp: datetime