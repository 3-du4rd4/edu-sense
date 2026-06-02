from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException

from repositories.session_repository import SessionRepository
from schemas.session import StartSessionRequest, FinishSessionRequest, UpdateSessionTasksRequest
from websocket.events import WebSocketEvent
from websocket.manager import websocket_manager
from repositories.environment_repository import EnvironmentRepository
from repositories.facial_metrics_repository import FacialMetricsRepository
from services.points_service import PointsService
from services.session_summary_service import SessionSummaryService


class SessionService:
    def __init__(self):
        self.repository = SessionRepository()
        self.environment_repository = EnvironmentRepository()
        self.facial_metrics_repository = FacialMetricsRepository()
        self.summary_service = SessionSummaryService()
        self.points_service = PointsService()


    async def start_session(self, data: StartSessionRequest) -> dict:
        active_session = await self.repository.get_active_session_by_user_id(data.userId)
        
        if active_session:
            raise HTTPException(
                status_code=400, 
                detail="User already has an active session"
            )
        
        now = datetime.now(timezone.utc)

        session_data = {
            "userId": data.userId,
            "startTime": now,
            "endTime": None,
            "durationSeconds": None,
            "createdAt": now,

            "summary": {
                "temperature": None,
                "noise": None,
                "light": None,
                "focus": None
            },

            "tasks": [task.model_dump() for task in data.tasks],
            "studyMode": data.studyMode,
            "timeGoal": data.timeGoal,
            "status": "active",

            "features": {
                "cameraEnabled": data.features.cameraEnabled,
                "sensorsEnabled": data.features.sensorsEnabled,
            },

            "points": {
                "earned": 0,
                "breakdown": {
                    "sessionCompleted": 0,
                    "timeGoalAchieved": 0,
                    "completedTasks": 0,
                    "focusBonus": 0
                }
            }
        }

        created_session = await self.repository.create_session(session_data=session_data)

        await websocket_manager.send_to_user(
            user_id=data.userId,
            event=WebSocketEvent.SESSION_STARTED,
            payload=created_session
        )

        return created_session


    async def finish_session(
            self, 
            session_id: str,
            data: FinishSessionRequest
    ) -> dict:
        session = await self.repository.get_by_id(session_id=session_id)
        
        if not session:
            raise HTTPException(
                status_code=404, 
                detail="Monitoring session not found"
            )

        if session["status"] != "active":
            raise HTTPException(
                status_code=400, 
                detail="Monitoring session is not active"
            )
        
        end_time = datetime.now(timezone.utc)
        start_time = session["startTime"]

        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)
            
        duration_seconds = int((end_time - start_time).total_seconds())

        readings = await self.environment_repository.get_readings_by_session(session_id=session_id)

        facial_metrics = await self.facial_metrics_repository.get_metrics_by_session(
            session_id=session_id
        )

        summary = self.summary_service.calculate_session_summary(
            environment_readings=readings,
            facial_metrics=facial_metrics,
        )

        final_tasks = [task.model_dump() for task in data.tasks]

        if not final_tasks:
            final_tasks = session.get("tasks", [])

        points = self.points_service.calculate_points(
            duration_seconds=duration_seconds,
            time_goal_minutes=session.get("timeGoal"),
            tasks=final_tasks,
            focus_average=summary.get("focus")
        )

        finished_session = await self.repository.finish_session(
            session_id=session_id, 
            end_time=end_time, 
            duration_seconds=duration_seconds,
            summary=summary,
            points=points,
            tasks=final_tasks
        )

        await websocket_manager.send_to_user(
            user_id=finished_session["userId"],
            event=WebSocketEvent.SESSION_FINISHED,
            payload=finished_session
        )

        return finished_session
    

    async def get_active_session(self, user_id: str) -> Optional[dict]:
        return await self.repository.get_active_session_by_user_id(user_id=user_id)
    

    async def get_user_sessions(
        self, 
        user_id: str,
        status: str | None = None,
        limit: int = 20
    ) -> list[dict]:
        return await self.repository.list_sessions_by_user_id(
            user_id=user_id,
            status=status,
            limit=limit
        )
    

    async def get_session_by_id(self, session_id: str) -> dict:
        session = await self.repository.get_by_id(session_id=session_id)

        if not session:
            raise HTTPException(
                status_code=404, 
                detail="Monitoring session not found"
            )

        return session
    

    async def update_session_tasks(
        self, 
        session_id: str, 
        data: UpdateSessionTasksRequest
    ) -> dict:
        session = await self.repository.get_by_id(session_id=session_id)

        if not session:
            raise HTTPException(
                status_code=404, 
                detail="Monitoring session not found"
            )

        if session["status"] != "active":
            raise HTTPException(
                status_code=400, 
                detail="Only active sessions can update tasks"
            )

        tasks = [task.model_dump() for task in data.tasks]

        updated_session = await self.repository.update_tasks(
            session_id=session_id,
            tasks=tasks
        )

        if not updated_session:
            raise HTTPException(
                status_code=404,
                detail="Monitoring session not found after update",
            )

        return updated_session