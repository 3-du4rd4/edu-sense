from fastapi import FastAPI

from routes import health, session, websocket
from db.mongo import connect_to_mongo, close_mongo_connection
from services.mqtt_client import start_mqtt

app = FastAPI()
# start_mqtt()



@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


app.include_router(health.router)
app.include_router(session.router)
app.include_router(websocket.router)