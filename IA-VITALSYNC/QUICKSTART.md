# 🚀 GUIA DE INÍCIO RÁPIDO

Este guia vai te levar do zero até ter features extraídas e prontas para treinar modelos de ML.

## ✅ CHECKLIST COMPLETO

### PASSO 1: Configuração do Ambiente

```bash
# Dar permissão de execução ao script de setup
chmod +x setup.sh

# Executar setup (cria venv e instala dependências)
./setup.sh

# OU fazer manualmente:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### PASSO 2: Baixar os Datasets

Você tem 3 opções:

#### Opção A: Download Manual (RECOMENDADO)

1. Acesse:
   - AFTDB: https://physionet.org/content/aftdb/1.0.0/
   - NSRDB: https://physionet.org/content/nsrdb/1.0.0/

2. Clique em "Files" e baixe as pastas necessárias

#### Opção B: Usando wget (Linux/Mac)

```bash
# Baixar AFTDB
cd data/raw/
wget -r -N -c -np https://physionet.org/files/aftdb/1.0.0/
mv physionet.org/files/aftdb/1.0.0/* aftdb/
rm -rf physionet.org

# Baixar NSRDB
wget -r -N -c -np https://physionet.org/files/nsrdb/1.0.0/
mv physionet.org/files/nsrdb/1.0.0/* nsrdb/
rm -rf physionet.org
```

#### Opção C: Script Automático (Experimental)

```bash
python src/download_datasets.py
```

### PASSO 3: Organizar os Dados

Após baixar, você deve ter esta estrutura:

```
data/raw/
├── aftdb/
│   ├── learning-set/
│   │   ├── a01.dat, a01.hea, a01.qrs
│   │   ├── a02.dat, a02.hea, a02.qrs
│   │   └── ... (mais arquivos)
│   ├── test-set-a/
│   │   └── ... (arquivos a01-a25)
│   └── test-set-b/
│       └── ... (arquivos b01-b10 ou similar)
└── nsrdb/
    ├── 16001.dat, 16001.hea, 16001.qrs
    ├── 16002.dat, 16002.hea, 16002.qrs
    └── ... (mais arquivos)
```

**⚠️ IMPORTANTE**: No dataset AFTDB, **todas as 3 pastas** contêm dados de Fibrilação Atrial. A divisão original era para uma competição, mas no nosso projeto **todos são exemplos de FA (label=1)**.

### PASSO 4: Verificar a Organização

```bash
python src/organize_datasets.py
```

Você deve ver algo como:

```
✅ TUDO CERTO! Os datasets estão organizados corretamente.
📊 RESUMO TOTAL:
   Total de registros: XXX
   - Fibrilação Atrial (label=1): YYY
   - Ritmo Normal (label=0): ZZZ
```

### PASSO 5: Extrair Features

```bash
python src/feature_extraction.py
```

Isso vai:
1. Ler todos os arquivos de ECG
2. Detectar picos R (batimentos cardíacos)
3. Calcular intervalos R-R
4. Extrair features estatísticas (desvio padrão, média, RMSSD, etc.)
5. Salvar em `data/processed/features.csv`

### PASSO 6: Verificar o Dataset Final

```bash
# Abrir Python
python

# Carregar e visualizar
import pandas as pd
df = pd.read_csv('data/processed/features.csv')
print(df.head())
print(df.info())
print(df.describe())
```

## 🎯 O QUE VOCÊ TERÁ AGORA

Após completar esses passos, você terá:

1. ✅ Um arquivo CSV (`features.csv`) com:
   - Uma linha para cada registro de ECG
   - Colunas com features extraídas (rr_std, rr_cv, rr_rmssd, etc.)
   - Uma coluna `label` (1=FA, 0=Normal)

2. ✅ Dados prontos para treinar modelos de ML!

## 🧪 PRÓXIMA FASE: Treinamento de Modelos

Com os dados processados, você está pronto para:

1. **Análise Exploratória** (ver distribuições, correlações)
2. **Dividir dados** em treino e teste
3. **Treinar modelos** (Random Forest, SVM, etc.)
4. **Avaliar performance** (Acurácia, Sensibilidade, Especificidade, ROC-AUC)

Quer que eu crie os scripts de treinamento agora? 🚀

## ❓ PROBLEMAS COMUNS

### Erro: "Não foi possível resolver a importação wfdb"

**Solução**: Certifique-se de que o ambiente virtual está ativado:
```bash
source venv/bin/activate
pip install wfdb
```

### Erro: "Pasta 'learning-set' não encontrada"

**Solução**: Verifique se você moveu os arquivos para o lugar certo. A estrutura deve estar exatamente como mostrado no Passo 3.

### Erro: "Apenas X pico(s) R encontrado(s)"

**Solução**: Isso é normal para alguns arquivos que podem ter poucos batimentos. O script automaticamente pula esses registros.

## 📞 SUPORTE

Se tiver dúvidas, revise:
1. O README.md principal
2. Os comentários dentro de cada arquivo .py
3. A documentação do WFDB: https://wfdb.readthedocs.io/

---

**Boa sorte! 🚀**
