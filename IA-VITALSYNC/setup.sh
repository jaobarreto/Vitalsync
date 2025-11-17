#!/bin/bash

# setup.sh
# Script de configuração inicial do projeto IA-VITALSYNC

echo "=========================================="
echo "🏥 IA-VITALSYNC - Setup Inicial"
echo "=========================================="

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    echo "   Por favor, instale Python 3.8 ou superior."
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Criar ambiente virtual
echo ""
echo "📦 Criando ambiente virtual..."
python3 -m venv venv

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar ambiente virtual!"
    exit 1
fi

echo "✅ Ambiente virtual criado!"

# Ativar ambiente virtual
echo ""
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Atualizar pip
echo ""
echo "⬆️  Atualizando pip..."
pip install --upgrade pip

# Instalar dependências
echo ""
echo "📥 Instalando dependências..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ SETUP CONCLUÍDO COM SUCESSO!"
echo "=========================================="
echo ""
echo "🚀 Próximos passos:"
echo ""
echo "1. Ative o ambiente virtual:"
echo "   source venv/bin/activate"
echo ""
echo "2. Baixe os datasets do PhysioNet:"
echo "   - AFTDB: https://physionet.org/content/aftdb/1.0.0/"
echo "   - NSRDB: https://physionet.org/content/nsrdb/1.0.0/"
echo ""
echo "3. Organize os dados em:"
echo "   data/raw/aftdb/ (com subpastas: learning-set, test-set-a, test-set-b)"
echo "   data/raw/nsrdb/ (arquivos diretos)"
echo ""
echo "4. Verifique a organização:"
echo "   python src/organize_datasets.py"
echo ""
echo "5. Extraia as features:"
echo "   python src/feature_extraction.py"
echo ""
echo "=========================================="
