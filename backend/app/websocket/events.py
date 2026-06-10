from enum import StrEnum


class WebSocketEvent(StrEnum):
    SESSION_STARTED = "session_started"
    SESSION_FINISHED = "session_finished"
    SESSION_PAUSED = "session_paused"
    SESSION_RESUMED = "session_resumed"
    ENVIRONMENT_UPDATE = "environment_update"
    FACIAL_METRICS_UPDATE = "facial_metrics_update"
    SENSOR_UPDATE = "sensor_update"
    VISION_UPDATE = "vision_update"
    NOTIFICATION_CREATED = "notification_created"