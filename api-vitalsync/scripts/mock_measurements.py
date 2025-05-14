import random
import time
import requests

API_URL = "http://localhost:3000/measurements/raw"

# Substitua esse ID por um que exista no seu banco de dados
USER_ID = "64f5e5b0d1b2a8c9e1234567"

def generate_mock_data():
    return {
        "userId": USER_ID,
        "irSamples": [random.randint(1000, 4000) for _ in range(100)],
        "redSamples": [random.randint(1000, 4000) for _ in range(100)],
        "sampleRate": 100
    }

while True:
    data = generate_mock_data()
    response = requests.post(API_URL, json=data)
    print(f"Status: {response.status_code}, Response: {response.text}")
    time.sleep(5)
