from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    health, 
    session, 
    websocket, 
    facial_metrics, 
    environment, 
    dashboard, 
    auth,
    notification
)
from app.mqtt.publisher import start_mqtt_publisher, stop_mqtt_publisher
from app.db.mongo import connect_to_mongo, close_mongo_connection
from app.mqtt.subscriber import start_mqtt_subscriber, stop_mqtt_subscriber
from app.core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await start_mqtt_publisher()
    await start_mqtt_subscriber()


@app.on_event("shutdown")
async def shutdown_event():
    await stop_mqtt_publisher()
    await stop_mqtt_subscriber()
    await close_mongo_connection()


app.include_router(auth.router)
app.include_router(health.router)
app.include_router(session.router)
app.include_router(websocket.router)
app.include_router(dashboard.router)
app.include_router(environment.router)
app.include_router(notification.router)
app.include_router(facial_metrics.router)