from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.test_db import router as test_db_router
from app.services.mqtt_client import start_mqtt

app = FastAPI()
start_mqtt()

app.include_router(health_router)
app.include_router(test_db_router)

@app.get("/")
def root():
    return {"message": "api test"}