from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import health, session, websocket, facial_metrics, environment, dashboard
from db.mongo import connect_to_mongo, close_mongo_connection
from mqtt.subscriber import start_mqtt_subscriber, stop_mqtt_subscriber

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await start_mqtt_subscriber()


@app.on_event("shutdown")
async def shutdown_event():
    await stop_mqtt_subscriber()
    await close_mongo_connection()


app.include_router(health.router)
app.include_router(session.router)
app.include_router(websocket.router)
app.include_router(dashboard.router)
app.include_router(environment.router)
app.include_router(facial_metrics.router)