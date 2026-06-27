import json
from datetime import datetime

import paho.mqtt.client as mqtt

from app.core.config import settings
from app.services.database import insert_data


def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker!")
    client.subscribe("study/#")


def on_message(client, userdata, msg):
    print(f"Received message from {msg.topic}: {msg.payload.decode()}")

    try:
        data = json.loads(msg.payload.decode())

        if msg.topic == "study/environment":
            data_type = "environment"
            source = "iot"
        
        elif msg.topic == "study/vision":
            data_type = "vision"
            source = "vision"
        
        else:
            return
        
        document = {
            "type": data_type,
            "source": source,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }

        insert_data(document)

    except Exception as e:
        print("Error processing message:", e)


def start_mqtt():
    client = mqtt.Client()

    client.on_connect = on_connect
    client.on_message = on_message

    client.username_pw_set(settings.MQTT_USERNAME, settings.MQTT_PASSWORD)

    client.tls_set()

    client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
    client.loop_start()