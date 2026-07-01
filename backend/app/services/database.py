from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URL)

db = client["edu_sense"]

def insert_data(data: dict):
    collection = db["environment_data"]
    result = collection.insert_one(data)
    return str(result.inserted_id)


def get_data():
    collection = db["environment_data"]
    data = list(collection.find())
    for item in data:
        item["_id"] = str(item["_id"])
    return data