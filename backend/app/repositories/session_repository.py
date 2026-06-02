from datetime import datetime
from typing import Optional

from bson import ObjectId

from db.mongo import get_database


class SessionRepository:
    def __init__(self):
        self.collection = get_database()["monitoring-sessions"]


    async def create_session(self, session_data: dict) -> dict:
        result = await self.collection.insert_one(session_data)

        session = await self.collection.find_one({"_id": result.inserted_id})
        return self._serialize(session)
    

    async def get_active_session_by_user_id(self, user_id: str) -> Optional[dict]:
        session = await self.collection.find_one({
            "userId": user_id,
            "status": "active"
        })
        
        if not session:
            return None
        
        return self._serialize(session)
    

    async def get_by_id(self, session_id: str) -> Optional[dict]:
        session = await self.collection.find_one({
            "_id": ObjectId(session_id)
        })
        
        if not session:
            return None
        
        return self._serialize(session)
    

    async def finish_session(
            self, 
            session_id: str, 
            end_time: datetime,
            duration_seconds: int,
            summary: dict,
            points: dict,
            tasks: list[dict]
        ) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "status": "finished",
                    "endTime": end_time,
                    "durationSeconds": duration_seconds,
                    "summary": summary,
                    "points": points,
                    "tasks": tasks
                }
            }
        )

        return await self.get_by_id(session_id)
    

    async def list_sessions_by_user_id(
        self, 
        user_id: str,
        status: str | None = None,
        limit: int = 20
    ) -> list[dict]:
        query = {"userId": user_id}

        if status:
            query["status"] = status

        cursor = self.collection.find(query).sort("startTime", -1).limit(limit)
        sessions = await cursor.to_list(length=limit)

        return [self._serialize(session) for session in sessions]
    

    async def update_tasks(
        self,
        session_id: str,
        tasks: list[dict]
    ) -> dict | None:
        await self.collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "tasks": tasks
                }
            }
        )

        return await self.get_by_id(session_id)
    

    def _serialize(self, session: dict) -> dict:
        session["_id"] = str(session["_id"])
        return session