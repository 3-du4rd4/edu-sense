from db.mongo import get_database


class EnvironmentRepository:
    def __init__(self):
        self.collection = get_database()['environment-readings']


    async def create_reading(self, reading_data: dict) -> dict:
        result = await self.collection.insert_one(reading_data)

        reading = await self.collection.find_one({'_id': result.inserted_id})
        
        return self._serialize(reading)


    def _serialize(self, reading: dict) -> dict:
        reading['_id'] = str(reading['_id'])

        return reading