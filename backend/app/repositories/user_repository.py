from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.db.mongo import get_database


class UserRepository:
    def __init__(self):
        self.collection = get_database()["users"]


    async def create_user(self, user_data: dict) -> dict:
        now = datetime.now(timezone.utc)

        user_data["createdAt"] = now
        user_data["updatedAt"] = now

        result = await self.collection.insert_one(user_data)

        user = await self.collection.find_one({"_id": ObjectId(result.inserted_id)})

        return self._serialize(user)
    

    async def get_by_email(self, email: str) -> Optional[dict]:
        user = await self.collection.find_one({
            "email": email.lower()
        })

        if not user:
            return None
        
        return self._serialize(user)
    

    async def get_by_id(self, user_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        
        user = await self.collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return None
        
        return self._serialize(user)
    

    async def email_exists(self, email: str) -> bool:
        user = await self.collection.find_one({
            "email": email.lower()
        })

        return user is not None
    

    def _serialize(self, user: dict) -> dict:
        user["_id"] = str(user["_id"])
        
        return user