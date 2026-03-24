import json
import time
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883, 60)

data = {
    "atention": "low",
    "eyes_closed": True,
}

client.publish("study/vision", json.dumps(data))
print("Sent:", data)