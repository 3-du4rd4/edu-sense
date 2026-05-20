from enum import StrEnum


class WebSocketEvent(StrEnum):
    SESSION_STARTED = "session_started"
    SESSION_FINISHED = "session_finished"
    SENSOR_UPDATE = "sensor_update"
    VISION_UPDATE = "vision_update"
    ALERT_CREATED = "alert_created"