import random
import time
import requests

API_URL = "http://localhost:3000/measurements/raw"

def generate_mock_data():
    return {
        "deviceId": "simulator01",
        "irSamples": [random.randint(20000, 60000) for _ in range(100)],
        "redSamples": [random.randint(15000, 50000) for _ in range(100)],
        "sampleRate": 100
    }

while True:
    response = requests.post(API_URL, json=generate_mock_data())
    print(f"Status: {response.status_code}, Response: {response.text}")
    time.sleep(5)