import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
    MQTT_BROKER = os.getenv("MQTT_BROKER")
    MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
    MQTT_TOPIC_ENVIRONMENT = os.getenv("MQTT_TOPIC_ENVIRONMENT")
    MQTT_USERNAME: str | None = None
    MQTT_PASSWORD: str | None = None
    APP_NAME = os.getenv("APP_NAME", "App")
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"

settings = Settings()