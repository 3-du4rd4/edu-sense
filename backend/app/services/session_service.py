from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException

from repositories.session_repository import SessionRepository
from schemas.session import StartSessionRequest


class SessionService:
    def __init__(self):
        self.repository = SessionRepository()


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

            "sumary": {
                "temperature": None,
                "noise": None,
                "light": None,
                "focus": None
            },

            "tasks": [],
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

        return await self.repository.create_session(session_data=session_data)


    async def finish_session(self, session_id: str) -> dict:
        session = await self.repository.get_session_by_id(session_id)
        
        if not session:
            raise HTTPException(
                status_code=404, 
                detail="Session not found"
            )

        if session["status"] != "active":
            raise HTTPException(
                status_code=400, 
                detail="Session is not active"
            )
        
        end_time = datetime.now(timezone.utc)
        start_time = session["startTime"]
        duration_seconds = int((end_time - start_time).total_seconds())

        return await self.repository.finish_session(
            session_id=session_id, 
            end_time=end_time, 
            duration_seconds=duration_seconds
        )
    

    async def get_active_session(self, user_id: str) -> Optional[dict]:
        return await self.repository.get_active_session_by_user_id(user_id=user_id)
    

    async def list_sessions(self, user_id: str) -> list[dict]:
        return await self.repository.list_sessions_by_user_id(user_id=user_id)