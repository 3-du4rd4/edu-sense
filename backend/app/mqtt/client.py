import aiomqtt

from core.config import settings


def get_mqtt_client() -> aiomqtt.Client:
    return aiomqtt.Client(
        hostname=settings.MQTT_BROKER,
        port=settings.MQTT_PORT,
        username=settings.MQTT_USERNAME,
        password=settings.MQTT_PASSWORD,
    )