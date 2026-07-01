from app.db.mongo import get_database


class PerformanceMetricsRepository:
    def __init__(self):
        self.collection = get_database()['performance-metrics']


    async def create_metric(self, metric_data: dict) -> dict:
        result = await self.collection.insert_one(metric_data)
        
        metric = await self.collection.find_one({'_id': result.inserted_id})

        return self._serialize(metric)
    

    def _serialize(self, metric: dict) -> dict:
        metric["_id"] = str(metric["_id"])
        return metric