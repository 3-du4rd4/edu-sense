import json
import paho.mqtt.client as mqtt
from app.config import settings
from app.services.database import insert_environment_data

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker!")
    client.subscribe("study/environment")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()}")

    try:
        data = json.loads(msg.payload.decode())
        insert_environment_data(data)
    except Exception as e:
        print("Error processing message:", e)

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
    client.loop_start()