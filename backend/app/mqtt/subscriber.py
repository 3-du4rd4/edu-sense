import asyncio

from app.core.config import settings
from app.mqtt.client import get_mqtt_client
from app.mqtt.handlers import handle_environment_message, handle_facial_metrics_message


mqtt_task: asyncio.Task | None = None


async def start_mqtt_subscriber():
    global mqtt_task
    
    mqtt_task = asyncio.create_task(_mqtt_listener())


async def stop_mqtt_subscriber():
    global mqtt_task
    
    if mqtt_task:
        mqtt_task.cancel()

        try:
            await mqtt_task
        except asyncio.CancelledError:
            print("MQTT subscriber stopped")


async def _mqtt_listener():
    print("Starting MQTT subscriber...")

    async with get_mqtt_client() as client:
        await client.subscribe(settings.MQTT_TOPIC_ENVIRONMENT)
        await client.subscribe(settings.MQTT_TOPIC_FACIAL_METRICS)

        print(f"Subscribed to MQTT topic: {settings.MQTT_TOPIC_ENVIRONMENT}")
        print(f"Subscribed to MQTT topic: {settings.MQTT_TOPIC_FACIAL_METRICS}")

        async for message in client.messages:
            topic = str(message.topic)
            payload = message.payload

            if topic.endswith("/environment"):
                await handle_environment_message(topic, payload)
                
            if topic.endswith("/facial-metrics"):
                await handle_facial_metrics_message(topic, payload)