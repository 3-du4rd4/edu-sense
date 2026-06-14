import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    BACKEND_WS_URL = os.getenv(
        "BACKEND_WS_URL",
        "ws://localhost:8000/ws/vision",
    )

    MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_TOPIC_FACIAL_METRICS = os.getenv(
        "MQTT_TOPIC_FACIAL_METRICS",
        "study/facial-metrics",
    )

    CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", "0"))
    CAPTURE_INTERVAL_SECONDS = float(
        os.getenv("CAPTURE_INTERVAL_SECONDS", "1")
    )

    EAR_THRESHOLD = float(os.getenv("EAR_THRESHOLD", "0.21"))
    MAR_THRESHOLD = float(os.getenv("MAR_THRESHOLD", "0.6"))
    TEMPORAL_WINDOW_SECONDS = int(
        os.getenv("TEMPORAL_WINDOW_SECONDS", "30")
    )


settings = Settings()