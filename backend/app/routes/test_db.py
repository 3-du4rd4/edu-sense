from fastapi import APIRouter
from app.services.database import insert_environment_data

router = APIRouter()

@router.get("/test-db")
def test_db():
    data = {
        "temperature": 25,
        "humidity": 60
    }

    inserted_id = insert_environment_data(data)

    return {
        "status": "success",
        "message": "Data inserted",
        "id": inserted_id
    }