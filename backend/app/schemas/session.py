from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class SessionFeatures(BaseModel):
    cameraEnabled: bool = True
    sensorsEnabled: bool = True


class PointsBreakdown(BaseModel):
    sessionCompleted: int = 0
    timeGoalAchieved: int = 0
    completedTasks: int = 0
    focusBonus: int = 0


class SessionPoints(BaseModel):
    earned: int = 0
    breakdown: PointsBreakdown = PointsBreakdown()


class StartSessionRequest(BaseModel):
    userId: str
    timeGoal: Optional[int] = None
    features: SessionFeatures


class SessionSummary(BaseModel):
    temperature: Optional[float] = None
    noise: Optional[float] = None
    light: Optional[float] = None
    focus: Optional[float] = None


class SessionTask(BaseModel):
    description: str = ""
    completed: bool = False


class SessionResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    startTime: datetime
    endTime: Optional[datetime] = None
    durationSeconds: Optional[int] = None
    createdAt: datetime
    summary: Optional[SessionSummary] = None
    tasks: Optional[list[SessionTask]] = None
    timeGoal: Optional[int] = None
    features: SessionFeatures
    status: str
    points: SessionPoints

    model_config = {
        "populate_by_name": True
    }