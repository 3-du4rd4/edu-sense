from app.db.mongo import get_database


class EnvironmentRepository:
    def __init__(self):
        self.collection = get_database()['environment-readings']


    async def create_reading(self, reading_data: dict) -> dict:
        result = await self.collection.insert_one(reading_data)

        reading = await self.collection.find_one({'_id': result.inserted_id})
        
        return self._serialize(reading)
    

    async def get_readings_by_session(self, session_id: str) -> list[dict]:
        cursor = self.collection.find({'sessionId': session_id}).sort('timestamp', 1)
        readings = await cursor.to_list(length=None)

        return [self._serialize(reading) for reading in readings]

    
    async def get_latest_reading_by_session(
        self,
        session_id: str
    ) -> dict | None:
        reading = await self.collection.find_one(
            {'sessionId': session_id},
            sort=[('timestamp', -1)]
        )

        return self._serialize(reading) if reading else None


    def _serialize(self, reading: dict) -> dict:
        reading['_id'] = str(reading['_id'])

        return reading