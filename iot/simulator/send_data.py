import json
import time
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883, 60)

data = {
    "temperature": 25,
    "humidity": 60
}

client.publish("study/environment", json.dumps(data))
print("Sent:", data)