# VitalSync - API

## 🏥 Monitoramento Inteligente do Sono para Prevenção de AVC em Idosos

Esta é a API da aplicação **VitalSync**, um sistema inovador que monitora padrões de sono e sinais vitais de idosos. Utilizando inteligência artificial, a API processa e armazena dados biométricos para prever riscos de AVC.

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- [NestJS](https://nestjs.com/) - Framework Node.js para APIs escaláveis.
- [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL.
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática e robustez no código.

### **Simulação de Dados**
- [Python](https://www.python.org/) - Script para simulação de medições.
- **Arquivo:** `scripts/mock_measurements.py` simula o funcionamento do sensor **MAX30102**.
- **Endpoint:** `POST /measurement/mock` para gerar dados simulados diretamente via API.

---

## 🔧 Instalação e Configuração

### **Pré-requisitos**
- Node.js e npm instalados
- MongoDB configurado
- Python para execução de scripts

### **Passos para rodar o backend**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vitalsync.git
cd vitalsync/api-vitalsync

# Instale as dependências
npm install

# Configure o banco de dados
cp .env.example .env
# Atualize as variáveis de ambiente conforme necessário

# Inicie a API
npm run start:dev
```

### **Executando a Simulação de Dados**
#### **Opção 1: Via script Python**
```bash
cd scripts
python mock_measurements.py
```

#### **Opção 2: Via API**
```bash
curl -X POST http://localhost:3000/measurement/mock
```

---

## 📡 Fluxo de Dados
- **Script Python (`mock_measurements.py`)** → Gera medições fictícias e envia para a API.
- **Backend NestJS** → Processa os dados e armazena no **MongoDB**.
- **Frontend (futuro)** → Exibirá informações para os usuários.

---

## 📜 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usá-lo e contribuir!

