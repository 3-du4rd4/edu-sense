from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EnvironmentPayload(BaseModel):
    temperature: float
    noise: float
    light: float


class EnvironmentReadingResponse(BaseModel):
    id: str
    sessionId: str
    temperature: float
    noise: float
    light: float
    timestamp: datetime