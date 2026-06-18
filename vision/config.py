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
    
    NORMAL_PUBLISH_INTERVAL_SECONDS = float(
    os.getenv("NORMAL_PUBLISH_INTERVAL_SECONDS", "60")
    )

    EVENT_PUBLISH_INTERVAL_SECONDS = float(
        os.getenv("EVENT_PUBLISH_INTERVAL_SECONDS", "5")
    )

    EVENT_COOLDOWN_SECONDS = float(
        os.getenv("EVENT_COOLDOWN_SECONDS", "15")
    )

    EYES_CLOSED_CONSECUTIVE_SECONDS = int(
        os.getenv("EYES_CLOSED_CONSECUTIVE_SECONDS", "3")
    )

    YAWNING_CONSECUTIVE_SECONDS = int(
        os.getenv("YAWNING_CONSECUTIVE_SECONDS", "3")
    )

    DATASET_WINDOW_STEP_SECONDS = int(
        os.getenv("DATASET_WINDOW_STEP_SECONDS", "5")
    )

    FATIGUE_MODEL_PATH = os.getenv(
        "FATIGUE_MODEL_PATH",
        "models/fatigue_model.joblib",
    )

    FATIGUE_THRESHOLD = float(
        os.getenv("FATIGUE_THRESHOLD", "0.7")
    )


settings = Settings()