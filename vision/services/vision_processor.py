import time
import asyncio
from datetime import datetime, timezone

from config import settings
from services.mqtt_client import mqtt_client
from services.face_metrics_service import FaceMetricsService
from services.temporal_window_service import TemporalWindowService
from services.fatigue_classifier_service import FatigueClassifierService


class VisionProcessor:
    def __init__(self):
        self.last_publish_time = 0
        self.last_event_time = 0
        self.current_session = None
        self.is_processing = False

        self.face_metrics_service = FaceMetricsService(
            ear_threshold=settings.EAR_THRESHOLD,
            mar_threshold=settings.MAR_THRESHOLD,
            eyes_closed_consecutive_seconds=settings.EYES_CLOSED_CONSECUTIVE_SECONDS,
            yawning_consecutive_seconds=settings.YAWNING_CONSECUTIVE_SECONDS
        )

        self.mqtt_publisher = mqtt_client

        self.temporal_window_service = TemporalWindowService(
            window_size_seconds=settings.TEMPORAL_WINDOW_SECONDS
        )

        self.fatigue_classifier_service = FatigueClassifierService(
            model_path=settings.FATIGUE_MODEL_PATH,
        )


    async def handle_session_started(self, session: dict):
        self.current_session = session

        camera_enabled = session.get("features", {}).get(
            "cameraEnabled",
            False,
        )

        if not camera_enabled:
            print("Session started without camera enabled")
            return

        self.is_processing = True

        print("Vision processing enabled")


    async def handle_session_paused(self):
        self.is_processing = False
        print("Session paused. Stopping capture temporarily.")


    async def handle_session_resumed(self, session: dict):
        self.current_session = session

        camera_enabled = session.get("features", {}).get(
            "cameraEnabled",
            False,
        )

        if not camera_enabled:
            print("Session resumed without camera enabled")
            return

        self.is_processing = True
        print("Session resumed. Starting capture.")


    async def handle_session_finished(self):
        self.current_session = None
        self.is_processing = False

        self.temporal_window_service.clear()

        self.last_publish_time = 0
        self.last_event_time = 0

        print("Session finished. Stopping capture.")



    def should_publish(self, metrics: dict) -> bool:
        now = time.time()

        has_event = (
            metrics["eyesClosed"]
            or metrics["yawning"]
        )

        if has_event:
            was_outside_window = (
                self.last_event_time == 0
                or now - self.last_event_time > settings.EVENT_COOLDOWN_SECONDS
            )

            self.last_event_time = now

            if was_outside_window:
                self.last_publish_time = now
                return True

        is_inside_event_window = (
            self.last_event_time > 0
            and now - self.last_event_time <= settings.EVENT_COOLDOWN_SECONDS
        )

        interval = (
            settings.EVENT_PUBLISH_INTERVAL_SECONDS
            if is_inside_event_window
            else settings.NORMAL_PUBLISH_INTERVAL_SECONDS
        )

        if now - self.last_publish_time >= interval:
            self.last_publish_time = now
            return True

        return False
    

    async def process_frame(self, frame):
        metrics = self.face_metrics_service.extract_metrics(frame)

        if metrics:
            self.temporal_window_service.add_sample(metrics)

            if not self.should_publish(metrics):
                return

            features = (
                self.temporal_window_service.build_features()
                if self.temporal_window_service.is_ready()
                else None
            )

            prediction = (
                self.fatigue_classifier_service.predict(features)
                if features
                else None
            )

            payload = {
                "sessionId": self.current_session["_id"],
                "ear": metrics["ear"],
                "mar": metrics["mar"],
                "eyesClosed": metrics["eyesClosed"],
                "yawning": metrics["yawning"],
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            if features:
                payload["features"] = features

            if prediction:
                payload["prediction"] = prediction

            self.mqtt_publisher.publish_facial_metrics(
                user_id=self.current_session["userId"],
                payload=payload
            )
        else:
            print("No face detected")