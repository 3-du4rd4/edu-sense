from fastapi import APIRouter
from app.services.database import insert_data, get_data

router = APIRouter()

@router.get("/test-db")
def test_db():
    received_data = get_data()

    return {
        "status": "success",
        "message": "Data retrieved",
        "data": received_data
    }