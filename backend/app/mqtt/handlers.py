import json

from pydantic import ValidationError

from schemas.environment import EnvironmentPayload
from services.environment_service import EnvironmentService


def extract_user_id_from_topic(topic: str) -> str | None:
    parts = topic.split('/')

    if len(parts) != 4:
        return None
    
    return parts[2]


async def handle_environment_message(topic: str, payload: bytes):
    user_id = extract_user_id_from_topic(topic)

    if not user_id:
        print(f"Invalid topic format: {topic}")
        return

    try:
        data = json.loads(payload.decode())
        environment_payload = EnvironmentPayload(**data)

    except json.JSONDecodeError:
        print(f"Invalid JSON payload received on topic {topic}")
        return
    
    except ValidationError as error:
        print(f"Validation error for payload on topic {topic}: {error}")
        return

    service = EnvironmentService()

    await service.process_environment_reading(
        user_id=user_id,
        payload=environment_payload
    )