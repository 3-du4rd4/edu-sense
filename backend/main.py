from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.test_db import router as test_db_router

app = FastAPI()

app.include_router(health_router)
app.include_router(test_db_router)

@app.get("/")
def root():
    return {"message": "api test"}