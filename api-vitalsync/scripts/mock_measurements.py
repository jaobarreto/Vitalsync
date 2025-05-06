import requests
import random
import datetime
import time

API_URL = "http://localhost:3000/measurement/mock"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODE5NTcyZThmOWY2MGNlZjcwMWNjYmUiLCJlbWFpbCI6Im5vdm8udXN1YXJpb0BleGVtcGxvLmNvbSIsImlhdCI6MTc0NjU3MDc4MiwiZXhwIjoxNzQ2NTc0MzgyfQ.DNQdI8rXWMKyKLryZO13_23yw7neA1NZxcTp6wUgCjc"  

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def generate_mock_data():
    is_emergency = random.random() < 0.1
    
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
        "userId": str("6819572e8f9f60cef701ccbe"), 
        "heartRate": int(heart_rate),       
        "bloodOxygenLevel": int(oxygen),     
        "hrv": int(hrv),
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "eventType": event_type,
        "notes": notes,
        "duration": random.randint(1, 30)
    }

while True:
    data = generate_mock_data()
    response = requests.post(API_URL, headers=headers, json=data)
    print(f"Enviado: {data}, Resposta: {response.status_code}, Texto: {response.text}")
    time.sleep(5)