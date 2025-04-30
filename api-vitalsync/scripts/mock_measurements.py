import requests
import random
import datetime
import time

API_URL = "http://localhost:3000/measurement"

def generate_mock_data():
    is_emergency = random.random() < 0.1  # 10% chance
    
    if is_emergency:
        heart_rate = random.randint(30, 49) if random.random() < 0.5 else random.randint(141, 220)
        oxygen = random.randint(70, 89)
        hrv = random.randint(1, 19)
        event_type = "emergency"
        notes = "Leitura crítica automática"
    else:
        heart_rate = random.randint(60, 100)
        oxygen = random.randint(90, 100)
        hrv = random.randint(20, 100)
        event_type = "routine"
        notes = None
    
    return {
        "userId": "12345",
        "heartRate": heart_rate,
        "bloodOxygenLevel": oxygen,
        "hrv": hrv,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "eventType": event_type,
        "notes": notes,
        "duration": random.randint(1, 30)
    }

while True:
    data = generate_mock_data()
    response = requests.post(API_URL, json=data)
    print(f"Enviado: {data}, Resposta: {response.status_code}")
    time.sleep(5)  # Enviar dados a cada 5 segundos