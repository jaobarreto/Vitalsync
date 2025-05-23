import serial
import requests
import time

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
time.sleep(2)

API_URL = "http://localhost:3000/measurements"

try:
    while True:
        line = ser.readline().decode('utf-8').strip()
        if line.startswith("BPM:"):
            try:
                bpm_value = int(line.split(":")[1].strip())
                print(f"Enviando BPM: {bpm_value}")

                data = {
                    "userId": "68253c885c74f4364f021de3",
                    "heartRate": bpm_value
                }
                headers = {'Content-Type': 'application/json'}
                response = requests.post(API_URL, json=data, headers=headers)
                print(f"Status: {response.status_code} | Resposta: {response.text}")
            except Exception as e:
                print(f"Erro ao enviar dados: {e}")
        time.sleep(0.1)
except KeyboardInterrupt:
    print("\nInterrompido pelo usuário. Fechando porta serial.")
    ser.close()
