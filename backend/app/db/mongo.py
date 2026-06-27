from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


client: AsyncIOMotorClient | None = None
database = None


async def connect_to_mongo():
    global client, database

    client = AsyncIOMotorClient(settings.MONGO_URL)
    database = client[settings.MONGO_DB_NAME]

    print("Connected to MongoDB")


async def close_mongo_connection():
    global client

    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    if database is None:
        raise RuntimeError("Database not initialized")
    
    return database