import asyncio

from config import settings
from services.webcam_service import WebcamService
from services.vision_processor import VisionProcessor
from services.session_ws_client import SessionWebSocketClient


class VisionServiceApp:
    def __init__(self):
        self.capture_task = None
        self.is_running_capture = False

        self.webcam_service = WebcamService(
            camera_index=settings.CAMERA_INDEX
        )

        self.vision_processor = VisionProcessor()

        self.ws_client = SessionWebSocketClient(
            url=settings.BACKEND_WS_URL
        )


    async def start(self):
        self.vision_processor.mqtt_publisher.connect()

        try:
            await self.ws_client.listen(self.handle_session_event)
        finally:
            await self.stop_capture()

            self.vision_processor.face_metrics_service.close()
            self.vision_processor.mqtt_publisher.disconnect()


    async def handle_session_event(self, event: str, payload: dict):
        print(f"Received event: {event}")

        if event == "session_started":
            await self.vision_processor.handle_session_started(payload)

            if self.vision_processor.is_processing:
                await self.start_capture()

        elif event == "session_paused":
            await self.vision_processor.handle_session_paused()
            await self.stop_capture()

        elif event == "session_resumed":
            await self.vision_processor.handle_session_resumed(payload)

            if self.vision_processor.is_processing:
                await self.start_capture()

        elif event == "session_finished":
            await self.vision_processor.handle_session_finished()
            await self.stop_capture()


    async def start_capture(self):
        if self.is_running_capture:
            return

        if not self.vision_processor.current_session:
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

        print("Vision capture stopped")


    async def capture_loop(self):
        while self.is_running_capture:
            frame = self.webcam_service.read_frame()

            if frame is None:
                print("Could not read frame")
                await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)
                continue

            await self.vision_processor.process_frame(frame)

            await asyncio.sleep(settings.CAPTURE_INTERVAL_SECONDS)


async def main():
    app = VisionServiceApp()

    await app.start()


if __name__ == "__main__":
    asyncio.run(main())