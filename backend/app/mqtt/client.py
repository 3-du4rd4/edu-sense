import ssl
import aiomqtt

from app.core.config import settings

ssl_context = ssl.create_default_context()


def get_mqtt_client() -> aiomqtt.Client:
    return aiomqtt.Client(
        hostname=settings.MQTT_BROKER,
        port=settings.MQTT_PORT,
        username=settings.MQTT_USERNAME,
        password=settings.MQTT_PASSWORD,
        tls_context=ssl_context
    )