from enum import StrEnum


class WebSocketEvent(StrEnum):
    SESSION_STARTED = "session_started"
    SESSION_FINISHED = "session_finished"
    ENVIRONMENT_UPDATE = "environment_update"
    FACIAL_METRICS_UPDATE = "facial_metrics_update"
    SENSOR_UPDATE = "sensor_update"
    VISION_UPDATE = "vision_update"
    ALERT_CREATED = "alert_created"