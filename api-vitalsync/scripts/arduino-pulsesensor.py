import serial
import requests

# Configurar a porta serial (ajuste para sua porta)
ser = serial.Serial('/dev/ttyACM0', 9600)

API_URL = "http://localhost:3000/measurement"

while True:
    line = ser.readline().decode('utf-8').strip()
    if line.startswith("BPM médio confiável:"):
        try:
            bpm_value = int(line.split(":")[1].strip())
            print(f"Enviando BPM: {bpm_value}")
            
            data = {
                "userId": "68253c885c74f4364f021de3",
                "bpm": bpm_value
            }

            response = requests.post(API_URL, json=data)
            print(f"Status: {response.status_code} | Resposta: {response.text}")
        except Exception as e:
            print(f"Erro: {e}")
