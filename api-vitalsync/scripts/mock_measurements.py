import requests
import random
import datetime
import time

API_URL = "http://localhost:3000/measurement"

def generate_mock_data():
    return {
        "userId": "12345",
        "heartRate": random.randint(60, 100),
        "bloodOxygenLevel": random.randint(90, 100),
        "hrv": random.randint(20, 100),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

while True:
    data = generate_mock_data()
    response = requests.post(API_URL, json=data)
    print(f"Enviado: {data}, Resposta: {response.status_code}")
    time.sleep(5)  # Enviar dados a cada 5 segundos
