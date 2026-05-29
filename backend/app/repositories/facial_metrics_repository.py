from db.mongo import get_database


class FacialMetricsRepository:
    def __init__(self):
        self.collection = get_database()['facial-metrics']


    async def create_metric(self, metric_data: dict) -> dict:
        result = await self.collection.insert_one(metric_data)
        
        metric = await self.collection.find_one({'_id': result.inserted_id})

        return self._serialize(metric)
    

    async def get_metrics_by_session(self, session_id: str) -> list[dict]:
        cursor = self.collection.find({'sessionId': session_id}).sort('timestamp', 1)
        metrics = await cursor.to_list(length=None)
        
        return [self._serialize(metric) for metric in metrics]
    

    def _serialize(self, metric: dict) -> dict:
        metric["_id"] = str(metric["_id"])
        return metric