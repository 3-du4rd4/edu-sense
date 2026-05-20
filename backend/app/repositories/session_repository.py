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
    

    async def finish_session(self, session_id: str, end_time: datetime, duration_seconds: int) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "status": "finished",
                    "endTime": end_time,
                    "durationSeconds": duration_seconds
                }
            }
        )

        return await self.get_by_id(session_id)
    

    async def list_sessions_by_user_id(self, user_id: str) -> list[dict]:
        cursor = self.collection.find({"userId": user_id}).sort("startTime", -1)
        sessions = await cursor.to_list(length=100)

        return [self._serialize(session) for session in sessions]
    

    def _serialize(self, session: dict) -> dict:
        session["_id"] = str(session["_id"])
        return session