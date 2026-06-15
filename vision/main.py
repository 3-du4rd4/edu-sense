import time
import asyncio
from datetime import datetime, timezone

from config import settings
from services.face_metrics_service import FaceMetricsService
from services.mqtt_publisher import MqttPublisher
from services.session_ws_client import SessionWebSocketClient
from services.webcam_service import WebcamService
from services.temporal_window_service import TemporalWindowService


class VisionServiceApp:
    def __init__(self):
        self.last_publish_time = 0
        self.last_event_time = 0
        self.current_session = None
        self.is_running_capture = False
        self.capture_task = None

        self.webcam_service = WebcamService(
            camera_index=settings.CAMERA_INDEX
        )

        self.face_metrics_service = FaceMetricsService(
            ear_threshold=settings.EAR_THRESHOLD,
            mar_threshold=settings.MAR_THRESHOLD,
        )

        self.mqtt_publisher = MqttPublisher(
            broker=settings.MQTT_BROKER,
            port=settings.MQTT_PORT,
            topic=settings.MQTT_TOPIC_FACIAL_METRICS,
        )

        self.ws_client = SessionWebSocketClient(
            url=settings.BACKEND_WS_URL
        )

        self.temporal_window_service = TemporalWindowService(
            window_size_seconds=settings.TEMPORAL_WINDOW_SECONDS
        )


    async def start(self):
        self.mqtt_publisher.connect()

        try:
            await self.ws_client.listen(self.handle_session_event)
        finally:
            await self.stop_capture()
            self.face_metrics_service.close()
            self.mqtt_publisher.disconnect()


    async def handle_session_event(self, event: str, payload: dict):
        print(f"Received event: {event}")

        if event == "session_started":
            await self.handle_session_started(payload)

        elif event == "session_paused":
            await self.handle_session_paused()

        elif event == "session_resumed":
            await self.handle_session_resumed(payload)

        elif event == "session_finished":
            await self.handle_session_finished()


    async def handle_session_started(self, session: dict):
        self.current_session = session

        camera_enabled = session.get("features", {}).get(
            "cameraEnabled",
            False,
        )

        if not camera_enabled:
            print("Session started without camera enabled")
            return

        await self.start_capture()


    async def handle_session_paused(self):
        print("Session paused. Stopping capture temporarily.")
        await self.stop_capture()


    async def handle_session_resumed(self, session: dict):
        self.current_session = session

        camera_enabled = session.get("features", {}).get(
            "cameraEnabled",
            False,
        )

        if not camera_enabled:
            print("Session resumed without camera enabled")
            return

        await self.start_capture()


    async def handle_session_finished(self):
        print("Session finished. Stopping capture.")
        self.current_session = None
        await self.stop_capture()


    async def start_capture(self):
        if self.is_running_capture:
            return

        if not self.current_session:
            return

        started = self.webcam_service.start()

        if not started:
            return

        self.is_running_capture = True
        self.capture_task = asyncio.create_task(self.capture_loop())

        print("Vision capture started")


    async def stop_capture(self):
        self.is_running_capture = False

        if self.capture_task:
            self.capture_task.cancel()

            try:
                await self.capture_task
            except asyncio.CancelledError:
                pass

            self.capture_task = None

        self.webcam_service.stop()
        self.temporal_window_service.clear()
        self.last_publish_time = 0
        self.last_event_time = 0

        print("Vision capture stopped")

    
    def should_publish(self, metrics: dict) -> bool:
        now = time.time()

        has_event = metrics["eyesClosed"] or metrics["yawning"]

        if has_event:
            self.last_event_time = now

        is_inside_event_window = (
            self.last_event_time > 0
            and now - self.last_event_time <= settings.EVENT_COOLDOWN_SECONDS
        )

        interval = (
            settings.EVENT_PUBLISH_INTERVAL_SECONDS
            if is_inside_event_window
            else settings.NORMAL_PUBLISH_INTERVAL_SECONDS
        )

        if now - self.last_publish_time < interval:
            return False

        self.last_publish_time = now
        return True


    async def capture_loop(self):
        while self.is_running_capture:
            if not self.current_session:
                await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)
                continue

            frame = self.webcam_service.read_frame()

            if frame is None:
                print("Could not read frame")
                await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)
                continue

            metrics = self.face_metrics_service.extract_metrics(frame)

            if metrics:
                self.temporal_window_service.add_sample(metrics)

                if not self.should_publish(metrics):
                    await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)
                    continue

                features = (
                    self.temporal_window_service.build_features()
                    if self.temporal_window_service.is_ready()
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

                self.mqtt_publisher.publish_facial_metrics(
                    user_id=self.current_session["userId"],
                    payload=payload
                )
            else:
                print("No face detected")

            await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)


async def main():
    app = VisionServiceApp()

    await app.start()


if __name__ == "__main__":
    asyncio.run(main())