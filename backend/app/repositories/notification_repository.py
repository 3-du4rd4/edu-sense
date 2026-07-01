from bson import ObjectId

from app.db.mongo import get_database


class NotificationRepository:
    def __init__(self):
        self.collection = get_database()["notifications"]


    async def create_notification(self, notification_data: dict) -> dict:
        result = await self.collection.insert_one(notification_data)

        notification = await self.collection.find_one(
            {"_id": result.inserted_id}
        )

        return self._serialize(notification)


    async def get_latest_by_source(
        self,
        user_id: str,
        session_id: str,
        source: str,
    ) -> dict | None:
        notification = await self.collection.find_one(
            {
                "userId": user_id,
                "sessionId": session_id,
                "source": source,
            },
            sort=[("createdAt", -1)],
        )

        if not notification:
            return None

        return self._serialize(notification)


    async def list_by_user(
        self,
        user_id: str,
        limit: int = 20,
    ) -> list[dict]:
        cursor = (
            self.collection
            .find({"userId": user_id})
            .sort("createdAt", -1)
            .limit(limit)
        )

        notifications = await cursor.to_list(length=limit)

        return [self._serialize(notification) for notification in notifications]


    async def mark_as_read(
        self,
        notification_id: str,
        user_id: str,
    ) -> dict | None:
        if not ObjectId.is_valid(notification_id):
            return None

        await self.collection.update_one(
            {
                "_id": ObjectId(notification_id),
                "userId": user_id,
            },
            {
                "$set": {
                    "read": True,
                }
            },
        )

        notification = await self.collection.find_one(
            {
                "_id": ObjectId(notification_id),
                "userId": user_id,
            }
        )

        if not notification:
            return None

        return self._serialize(notification)


    async def mark_all_as_read(self, user_id: str) -> None:
        await self.collection.update_many(
            {"userId": user_id},
            {
                "$set": {
                    "read": True,
                }
            },
        )


    def _serialize(self, notification: dict) -> dict:
        notification["_id"] = str(notification["_id"])
        return notification