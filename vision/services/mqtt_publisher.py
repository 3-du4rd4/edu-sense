import ssl
import json

import paho.mqtt.client as mqtt


class MqttPublisher:
    def __init__(
        self, 
        broker: str, 
        port: int,
        topic: str,
        username: str,
        password: str
    ):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.username = username
        self.password = password

        self.client = mqtt.Client(
            client_id="vision-service",
        )

        self.client.username_pw_set(
            self.username,
            self.password
        )

        self.client.tls_set(
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS,
        )


    def connect(self):
        print(f"Connecting to MQTT broker: {self.broker}:{self.port}")

        self.client.connect(self.broker, self.port)
        self.client.loop_start()

        print("Connected to MQTT broker")


    def publish_facial_metrics(self, user_id: str, payload: dict):
        message = json.dumps(payload)

        topic = f"edu-sense/users/{user_id}/facial-metrics"

        self.client.publish(topic, message)


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

        print("Disconnected from MQTT broker")