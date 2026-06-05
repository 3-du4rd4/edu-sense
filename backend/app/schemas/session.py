from datetime import datetime
from typing import Optional, Literal

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
    breakdown: PointsBreakdown = Field(default_factory=PointsBreakdown)


class SessionTask(BaseModel):
    id: str
    title: str
    completed: bool = False


class StartSessionRequest(BaseModel):
    userId: str
    timeGoal: Optional[int] = None
    studyMode: Literal["normal", "focus", "reading"] = "normal"
    tasks: Optional[list[SessionTask]] = Field(default_factory=list)
    features: SessionFeatures = Field(default_factory=SessionFeatures)


class SessionSummary(BaseModel):
    temperature: Optional[float] = None
    noise: Optional[float] = None
    light: Optional[float] = None
    focus: Optional[float] = None


class PauseInterval(BaseModel):
    pausedAt: datetime
    resumedAt: Optional[datetime] = None


class FinishSessionRequest(BaseModel):
    tasks: list[SessionTask] = Field(default_factory=list)


class SessionResponse(BaseModel):
    id: str = Field(alias="_id")
    userId: str
    startTime: datetime
    endTime: Optional[datetime] = None
    durationSeconds: Optional[int] = None
    createdAt: datetime
    summary: SessionSummary
    tasks: list[SessionTask]
    timeGoal: Optional[int] = None
    studyMode: Literal["normal", "focus", "reading"] = "normal"
    features: SessionFeatures
    status: Literal["active", "paused", "finished"]
    points: SessionPoints
    pauseIntervals: list[PauseInterval] = Field(default_factory=list)

    model_config = {
        "populate_by_name": True
    }


class UpdateSessionTasksRequest(BaseModel):
    tasks: list[SessionTask] = Field(default_factory=list)
