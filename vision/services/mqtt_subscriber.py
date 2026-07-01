import ssl
import json
import asyncio

import paho.mqtt.client as mqtt


class MqttSubscriber:
    def __init__(
        self, 
        broker: str, 
        port: int,
        topic: str,
        username: str,
        password: str,
        callback
    ):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.username = username
        self.password = password
        self.callback = callback

        self.client = mqtt.Client(
            client_id="vision-subscriber",
        )

        self.client.username_pw_set(
            self.username,
            self.password
        )

        self.client.tls_set(
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS,
        )

        self.client.on_message = self._on_message


    def connect(self):
        self.loop = asyncio.get_event_loop()

        print(f"Connecting MQTT subscriber...")

        self.client.connect(self.broker, self.port)
        self.client.subscribe(self.topic)

        self.client.loop_start()

        print(f"Subscribed to topic: {self.topic}")


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

        print("MQTT subscriber disconnected")


    def _on_message(
        self,
        client,
        userdata,
        message,
    ):
        data = json.loads(
            message.payload.decode()
        )

        asyncio.run_coroutine_threadsafe(
            self.callback(
                data["event"],
                data["payload"]
            ),
            self.loop
        )