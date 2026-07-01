import numpy as np
import cv2
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from services.session_ws_client import SessionWebSocketClient
from services.mqtt_client import mqtt_client
from services.vision_processor import VisionProcessor
from config import settings


processor = VisionProcessor()


# ws_client = SessionWebSocketClient(
#     url=settings.BACKEND_WS_URL
# )


async def handle_session_event(
    event: str,
    payload: dict
):
    print(f"Received event: {event}")

    if event == "session_started":
        await processor.handle_session_started(payload)

    elif event == "session_paused":
        await processor.handle_session_paused()

    elif event == "session_resumed":
        await processor.handle_session_resumed(payload)

    elif event == "session_finished":
        await processor.handle_session_finished()


@asynccontextmanager
async def lifespan(app: FastAPI):
    mqtt_client.connect()

    try:
        mqtt_client.subscribe(
            topic=settings.MQTT_TOPIC_CONTROL_VISION,
            callback=handle_session_event
        )

        yield

    finally:
        mqtt_client.disconnect()

        processor.face_metrics_service.close()


app = FastAPI(
    title="EduSense Vision Service",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok"
    }


@app.post("/analyze-frame")
async def analyze_frame(
    frame: UploadFile = File(...)
):
    contents = await frame.read()

    np_array = np.frombuffer(contents, np.uint8)

    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if image is None:
        return {
            "success": False,
            "message": "Invalid image data"
        }
    
    await processor.process_frame(image)

    return {
        "success": True
    }