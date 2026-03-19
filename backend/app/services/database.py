from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URL)

db = client["edu_sense"]

def insert_environment_data(data: dict):
    collection = db["environment_data"]
    result = collection.insert_one(data)
    return str(result.inserted_id)