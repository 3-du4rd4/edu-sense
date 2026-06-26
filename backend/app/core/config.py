import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

    MQTT_BROKER = os.getenv("MQTT_BROKER")
    MQTT_PORT = int(os.getenv("MQTT_PORT"))
    MQTT_TOPIC_ENVIRONMENT = os.getenv("MQTT_TOPIC_ENVIRONMENT")
    MQTT_TOPIC_FACIAL_METRICS = os.getenv("MQTT_TOPIC_FACIAL_METRICS")
    MQTT_USERNAME = os.getenv("MQTT_USERNAME")
    MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")

    APP_NAME = os.getenv("APP_NAME", "App")
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"

    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES"))

settings = Settings()