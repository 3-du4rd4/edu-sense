from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EnvironmentPayload(BaseModel):
    temperature: float
    noise: float
    light: float


class EnvironmentReadingRequest(BaseModel):
    userId: str
    temperature: float
    light: float
    noise: float


class EnvironmentReadingResponse(BaseModel):
    _id: str
    sessionId: str
    temperature: float
    noise: float
    light: float
    timestamp: datetime