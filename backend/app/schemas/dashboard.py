from typing import Literal

from pydantic import BaseModel


class MonthStats(BaseModel):
    totalStudyMinutes: int
    totalSessions: int


class LastSession(BaseModel):
    startedAt: str
    durationSeconds: int
    focusAverage: float | None = None
    temperatureAverage: float | None = None
    lightAverage: float | None = None
    noiseAverage: float | None = None
    pointsEarned: int


class DailyStudyMinutes(BaseModel):
    date: str
    minutes: int


class DashboardChart(BaseModel):
    dailyStudyMinutes: list[DailyStudyMinutes]


class DashboardScore(BaseModel):
    totalPoints: int
    level: int
    pointsToNextLevel: int


class DashboardInsight(BaseModel):
    type: Literal["focus", "environment", "consistency", "productivity"]
    description: str


class DashboardTips(BaseModel):
    description: str


class DashboardResponse(BaseModel):
    monthStats: MonthStats
    lastSession: LastSession | None
    chart: DashboardChart
    score: DashboardScore
    insights: list[DashboardInsight]
    tips: list[DashboardTips]


class DashboardCalendarResponse(BaseModel):
    studiedDates: list[str]
    streakDates: list[str]
    currentStreak: int