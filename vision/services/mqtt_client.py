import ssl
import json
import asyncio

import paho.mqtt.client as mqtt
from config import settings


class MqttClient:
    def __init__(
        self,
        broker: str,
        port: int,
        username: str,
        password: str,
        client_id: str = "vision-service",
    ):
        self.broker = broker
        self.port = port

        self.client = mqtt.Client(
            client_id=client_id,
        )

        self.client.username_pw_set(
            username,
            password,
        )

        self.client.tls_set(
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS,
        )

        self.loop = None
        self.callbacks = {}

        self.client.on_message = self._on_message
        self.client.on_connect = self._on_connect


    def connect(self):
        self.loop = asyncio.get_running_loop()

        print(
            f"Connecting to MQTT broker: "
            f"{self.broker}:{self.port}"
        )

        self.client.connect(
            self.broker,
            self.port,
        )

        self.client.loop_start()

        print("MQTT loop started (waiting on_connect...)")


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

        print(
            "Disconnected from MQTT broker"
        )


    def subscribe(
        self,
        topic: str,
        callback,
    ):
        self.callbacks[topic] = callback

        print(f"Registered subscription for topic: {topic}")


    def publish(
        self,
        topic: str,
        payload: dict,
        retain: bool = False,
    ):
        self.client.publish(
            topic,
            json.dumps(payload),
            retain=retain,
        )


    def publish_facial_metrics(
        self,
        user_id: str,
        payload: dict,
    ):
        self.publish(
            f"edu-sense/users/{user_id}/facial-metrics",
            payload,
        )


    def _on_message(
        self,
        client,
        userdata,
        message,
    ):
        try:
            data = json.loads(
                message.payload.decode()
            )

            callback = self.callbacks.get(
                message.topic
            )

            if callback:
                asyncio.run_coroutine_threadsafe(
                    callback(
                        data["event"],
                        data["payload"],
                    ),
                    self.loop,
                )

        except Exception as e:
            print(
                f"MQTT error: {e}"
            )

        
    def _on_connect(self, client, userdata, flags, rc):
        print("MQTT CONNECTED")

        for topic in self.callbacks.keys():
            client.subscribe(topic)
            print(f"Subscribed to topic: {topic}")


mqtt_client = MqttClient(
    broker=settings.MQTT_BROKER,
    port=settings.MQTT_PORT,
    username=settings.MQTT_USERNAME,
    password=settings.MQTT_PASSWORD
)