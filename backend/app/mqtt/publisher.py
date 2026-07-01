import json
from fastapi.encoders import jsonable_encoder

from app.core.config import settings
from app.mqtt.client import get_mqtt_client

publisher = None


async def start_mqtt_publisher():
    global publisher
    
    publisher = get_mqtt_client()
    await publisher.__aenter__()

    print("MQTT publisher started")


async def stop_mqtt_publisher():
    global publisher

    if publisher:
        await publisher.__aexit__(None, None, None)

        print("MQTT publisher stopped")


async def publish_vision_control(payload: dict, retain=False):
    await publisher.publish(
        settings.MQTT_TOPIC_CONTROL_FACIAL_METRICS,
        json.dumps(
            jsonable_encoder(payload)
        ),
        retain=retain,
    )


async def publish_environment_control(payload: dict, retain=False):
    await publisher.publish(
        settings.MQTT_TOPIC_CONTROL_ENVIRONMENT,
        json.dumps(
            jsonable_encoder(payload)
        ),
        retain=retain,
    )