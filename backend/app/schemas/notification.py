from datetime import datetime
from typing import Literal

from pydantic import BaseModel


NotificationType = Literal["environment", "facial"]
NotificationSeverity = Literal["info", "warning", "critical"]
NotificationSource = Literal[
    "temperature",
    "light",
    "noise",
    "eyesClosed",
    "yawning",
    "fatigue",
]


class NotificationResponse(BaseModel):
    _id: str
    userId: str
    sessionId: str
    type: NotificationType
    severity: NotificationSeverity
    source: NotificationSource
    title: str
    message: str
    value: float | bool
    threshold: float | bool | None = None
    read: bool
    createdAt: datetime