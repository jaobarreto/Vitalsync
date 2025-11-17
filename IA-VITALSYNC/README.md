# 🏥 IA-VITALSYNC

Sistema de Inteligência Artificial para Classificação de Fibrilação Atrial a partir de sinais de Eletrocardiograma (ECG).

## 📋 Objetivo

Desenvolver um modelo de **Aprendizado Supervisionado** para classificação binária de ECG:
- **Classe 1**: Fibrilação Atrial (FA)
- **Classe 0**: Ritmo Sinusal Normal

## 🗂️ Estrutura do Projeto

```
IA-VITALSYNC/
├── data/
│   ├── raw/                    # Dados brutos dos datasets
│   │   ├── aftdb/              # Dataset de Fibrilação Atrial
│   │   │   ├── learning-set/   # Todos são exemplos de FA
│   │   │   ├── test-set-a/     # Todos são exemplos de FA
│   │   │   └── test-set-b/     # Todos são exemplos de FA
│   │   └── nsrdb/              # Dataset de Ritmo Normal
│   └── processed/              # Dados processados
│       └── features.csv        # Features extraídas
├── src/                        # Código fonte
│   ├── data_loader.py          # Carregamento de dados
│   ├── feature_extraction.py   # Extração de features
│   ├── organize_datasets.py    # Verificador de estrutura
│   └── model.py                # Treinamento (a criar)
├── notebooks/                  # Jupyter Notebooks para análise
├── models/                     # Modelos treinados
├── reports/                    # Relatórios e visualizações
└── requirements.txt            # Dependências Python
```

## 🚀 Começando

### 1. Instalar Dependências

```bash
# Criar ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # No macOS/Linux
# ou
venv\Scripts\activate  # No Windows

# Instalar pacotes
pip install -r requirements.txt
```

### 2. Organizar os Datasets

#### Dataset AFTDB (Fibrilação Atrial)

**Fonte**: [PhysioNet - AFTDB](https://physionet.org/content/aftdb/1.0.0/)

**Importante**: Este dataset foi criado para uma competição de ML sobre "terminação de FA". Para nosso projeto, **IGNORAMOS** essa divisão original. **TODOS** os registros das três pastas (`learning-set`, `test-set-a`, `test-set-b`) são considerados exemplos confirmados de **Fibrilação Atrial** (label=1).

**Como organizar**:
1. Baixe o dataset completo
2. Mova a pasta `aftdb` (contendo as 3 subpastas) para `data/raw/`
3. A estrutura deve ficar:
   ```
   data/raw/aftdb/
   ├── learning-set/
   ├── test-set-a/
   └── test-set-b/
   ```

#### Dataset NSRDB (Ritmo Normal)

**Fonte**: [PhysioNet - NSRDB](https://physionet.org/content/nsrdb/1.0.0/)

Estes são registros de pacientes saudáveis com ritmo sinusal normal (label=0).

**Como organizar**:
1. Baixe o dataset completo
2. Mova a pasta `nsrdb` para `data/raw/`
3. A estrutura deve ficar:
   ```
   data/raw/nsrdb/
   ├── arquivo1.dat
   ├── arquivo1.hea
   └── arquivo1.qrs
   ```

### 3. Verificar Organização dos Dados

Execute o script verificador:

```bash
python src/organize_datasets.py
```

Este script irá:
- ✅ Verificar se todas as pastas estão no lugar correto
- ✅ Contar quantos registros foram encontrados
- ✅ Validar a presença dos arquivos `.dat`, `.hea` e `.qrs`

### 4. Extrair Features

Após organizar os dados, extraia as características dos sinais:

```bash
python src/feature_extraction.py
```

Este script irá:
- Processar **TODOS** os registros das 3 pastas do aftdb como FA (label=1)
- Processar todos os registros do nsrdb como Normal (label=0)
- Calcular features de variabilidade R-R (desvio padrão, RMSSD, CV, etc.)
- Salvar tudo em `data/processed/features.csv`

## 🧠 Lógica de Extração de Features

### Por que Intervalos R-R?

A **Fibrilação Atrial** é caracterizada por um ritmo **"irregularmente irregular"**. Isso significa que:

- **FA**: Intervalos R-R variam muito → **Desvio Padrão ALTO**
- **Normal**: Intervalos R-R são consistentes → **Desvio Padrão BAIXO**

### Features Extraídas

Para cada registro de ECG, extraímos:

| Feature | Descrição | Relevância para FA |
|---------|-----------|-------------------|
| `rr_mean` | Média dos intervalos R-R | Básica |
| `rr_std` | **Desvio padrão** | ⭐⭐⭐ **MUITO ALTA** |
| `rr_cv` | **Coeficiente de Variação** | ⭐⭐⭐ **MUITO ALTA** |
| `rr_rmssd` | **RMSSD** (variabilidade sucessiva) | ⭐⭐⭐ **MUITO ALTA** |
| `rr_median` | Mediana dos intervalos | Moderada |
| `rr_min` / `rr_max` | Valores extremos | Moderada |
| `rr_range` | Amplitude total | Alta |
| `mean_hr_bpm` | Frequência cardíaca média | Básica |

## 📊 Próximos Passos

1. ✅ **Fase 1**: Configuração e extração de features (CONCLUÍDA com este setup)
2. ⏳ **Fase 2**: Análise exploratória dos dados (visualizações, estatísticas)
3. ⏳ **Fase 3**: Treinamento de modelos (Random Forest, SVM, etc.)
4. ⏳ **Fase 4**: Avaliação (Sensibilidade, Especificidade, ROC-AUC)
5. ⏳ **Fase 5**: Deploy e predição em novos dados

## 📚 Recursos

- [PhysioNet](https://physionet.org/) - Plataforma de dados médicos
- [wfdb Python Package](https://wfdb.readthedocs.io/) - Documentação oficial
- [Fibrilação Atrial - Wikipedia](https://pt.wikipedia.org/wiki/Fibrila%C3%A7%C3%A3o_atrial)

## ⚠️ Aviso Importante

Este sistema é uma **ferramenta de auxílio** e **NÃO substitui** o diagnóstico de um cardiologista qualificado. Validação clínica é fundamental antes de qualquer uso prático.

## 📝 Licença

Projeto educacional para fins de pesquisa em IA aplicada à saúde.

---

**Desenvolvido por**: Davi Mathais de Almeida  
**Data**: Novembro 2025
