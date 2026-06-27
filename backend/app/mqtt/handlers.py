import json

from pydantic import ValidationError

from app.schemas.environment import EnvironmentPayload
from app.services.environment_service import EnvironmentService

from app.schemas.facial_metrics import FacialMetricsRequest
from app.services.facial_metrics_service import FacialMetricsService


def extract_user_id_from_topic(topic: str) -> str | None:
    parts = topic.split('/')

    if len(parts) != 4:
        return None
    
    return parts[2]


async def handle_environment_message(topic: str, payload: bytes):
    try:
        data = json.loads(payload.decode())
        environment_payload = EnvironmentPayload(**data)

        print(f"Received environment payload on topic {topic}: {environment_payload}")

    except json.JSONDecodeError:
        print(f"Invalid JSON payload received on topic {topic}")
        return
    
    except ValidationError as error:
        print(f"Validation error for payload on topic {topic}: {error}")
        return

    service = EnvironmentService()

    await service.process_environment_reading(
        data=environment_payload
    )


async def handle_facial_metrics_message(topic: str, payload: bytes):
    
    user_id = extract_user_id_from_topic(topic)

    if not user_id:
        print(f"Invalid topic format: {topic}")
        return

    try:
        data = json.loads(payload.decode())

        facial_metrics_payload = FacialMetricsRequest(
            userId=user_id,
            **data
        )

    except json.JSONDecodeError:
        print(f"Invalid JSON payload received on topic {topic}")
        return
    
    except ValidationError as error:
        print(f"Validation error for payload on topic {topic}: {error}")
        return

    service = FacialMetricsService()

    await service.create_metric(facial_metrics_payload)