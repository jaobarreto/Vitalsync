# 🏥 GUIA DE USO - Pipeline de Predição VitalSync

## 📋 O QUE É O PIPELINE DE PREDIÇÃO?

O `predict.py` é um script que **classifica novos ECGs** como:
- ✅ **Ritmo Sinusal Normal** (Classe 0)
- ⚠️ **Fibrilação Atrial** (Classe 1)

Ele usa o modelo **Random Forest** treinado com **100% de acurácia**!

---

## 🚀 COMO USAR (Básico)

### 1️⃣ Formato Mais Simples

```bash
python src/predict.py <caminho_do_arquivo>
```

**Exemplo:**
```bash
python src/predict.py data/raw/aftdb/learning-set/n01
```

**Resultado:**
```
================================================================================
🏥 VITALSYNC - CLASSIFICADOR DE ECG
================================================================================
Modelo: Random Forest (ROC-AUC: 1.000)
Classes: 0 = Ritmo Normal | 1 = Fibrilação Atrial

================================================================================
🎯 RESULTADO DA PREDIÇÃO
================================================================================

⚠️ Diagnóstico: Fibrilação Atrial
   Status: ANORMAL
   Confiança: 98.0%

================================================================================
```

---

## 🔧 OPÇÕES AVANÇADAS

### 2️⃣ Mostrar Probabilidades (`--show-proba` ou `-p`)

```bash
python src/predict.py data/raw/nsrdb/16265 --annotation-ext atr --show-proba
```

**Saída adicional:**
```
📊 PROBABILIDADES:
   • Ritmo Normal:  99.0%
   • Fibrilação Atrial:   1.0%
```

---

### 3️⃣ Modo Detalhado (`--verbose` ou `-v`)

```bash
python src/predict.py data/raw/aftdb/test-set-a/a01 --verbose
```

**Mostra:**
- ✅ Etapas do pipeline (Carregar → Extrair → Normalizar → Prever)
- ✅ Features extraídas (CV, RMSSD, frequência cardíaca)
- ✅ Interpretação clínica

**Exemplo de saída:**
```
📊 ETAPA 1/3: Extraindo features do ECG...
   ✅ Features extraídas:
      • Número de batimentos: 81
      • Frequência de amostragem: 128 Hz
      • RR médio: 0.742 s
      • RR CV: 22.64% ⚠️ ALTO

🔄 ETAPA 2/3: Normalizando features...
   ✅ Features normalizadas (média≈0, std≈1)

🤖 ETAPA 3/3: Fazendo predição com Random Forest...
   ✅ Predição concluída!

💡 INTERPRETAÇÃO:
   • CV alto (22.6%) indica alta irregularidade → Suspeita de FA
```

---

### 4️⃣ Combinar Tudo (`-v` + `-p`)

```bash
python src/predict.py data/raw/aftdb/learning-set/n03 -v -p
```

Mostra **tudo**: etapas detalhadas + probabilidades + interpretação!

---

## 📂 DIFERENTES TIPOS DE ARQUIVO

### ECGs do AFTDB (Fibrilação Atrial)
```bash
# Usa .qrs por padrão
python src/predict.py data/raw/aftdb/learning-set/n01
python src/predict.py data/raw/aftdb/test-set-a/a05
python src/predict.py data/raw/aftdb/test-set-b/b01
```

### ECGs do NSRDB (Ritmo Normal)
```bash
# Precisa especificar --annotation-ext atr
python src/predict.py data/raw/nsrdb/16265 --annotation-ext atr
python src/predict.py data/raw/nsrdb/16272 --annotation-ext atr
```

**Dica:** O script tenta detectar automaticamente o formato se `.qrs` não existir!

---

## 📖 EXEMPLOS PRÁTICOS

### Exemplo 1: Diagnóstico Rápido
```bash
python src/predict.py data/raw/aftdb/learning-set/n01
```
**Quando usar:** Você só quer saber se é FA ou Normal

---

### Exemplo 2: Análise Detalhada
```bash
python src/predict.py data/raw/aftdb/learning-set/n01 --verbose --show-proba
```
**Quando usar:** Você quer entender COMO o modelo chegou na conclusão

---

### Exemplo 3: Testar Ritmo Normal
```bash
python src/predict.py data/raw/nsrdb/16265 --annotation-ext atr -v
```
**Quando usar:** Validar que o modelo detecta corretamente ECGs normais

---

## 🎯 ENTENDENDO A SAÍDA

### Símbolos:
- ✅ = **Ritmo Normal** (tudo OK)
- ⚠️ = **Fibrilação Atrial** (anormal)

### Confiança:
- **> 90%**: Modelo muito confiante
- **70-90%**: Modelo confiante
- **50-70%**: Modelo incerto (caso limítrofe)

### Features Importantes:
- **CV < 5%**: Ritmo regular → Normal
- **CV > 15%**: Ritmo irregular → Provável FA
- **CV 5-15%**: Zona cinza (depende de outras features)

---

## 🔍 COMO O PIPELINE FUNCIONA (Por Dentro)

```
┌─────────────────────────────────────────────────────────┐
│               PIPELINE DE PREDIÇÃO                       │
└─────────────────────────────────────────────────────────┘

1️⃣ CARREGAR ECG
   ├─ Lê arquivo .dat (sinal de ECG)
   ├─ Lê arquivo .qrs ou .atr (anotações dos picos R)
   └─ Extrai intervalos R-R

2️⃣ EXTRAIR FEATURES (15 features)
   ├─ rr_mean, rr_std, rr_cv (variabilidade)
   ├─ rr_rmssd (diferenças sucessivas)
   ├─ rr_median, rr_min, rr_max
   ├─ Percentis (25, 75), IQR
   └─ Frequência cardíaca média

3️⃣ NORMALIZAR
   ├─ Usa scaler.pkl (salvo no treinamento)
   ├─ Converte para média=0, desvio=1
   └─ CRÍTICO: Mesmo scaler do treinamento!

4️⃣ PREVER
   ├─ Usa best_model.pkl (Random Forest)
   ├─ Calcula probabilidades
   └─ Retorna classe + confiança
```

---

## ⚙️ OPÇÕES COMPLETAS

```bash
python src/predict.py --help
```

**Parâmetros:**
- `record_path`: Caminho do ECG (obrigatório)
- `--annotation-ext {qrs,atr}`: Tipo de anotação (padrão: qrs)
- `--verbose, -v`: Modo detalhado
- `--show-proba, -p`: Mostrar probabilidades

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Erro: "Modelo não encontrado"
```bash
# Treinar o modelo primeiro!
python src/train_model.py
```

### Erro: "Arquivo não encontrado"
```bash
# Verificar se o arquivo existe
ls data/raw/aftdb/learning-set/
```

### Erro com NSRDB
```bash
# Adicionar --annotation-ext atr
python src/predict.py data/raw/nsrdb/16265 --annotation-ext atr
```

---

## 📊 TESTANDO O MODELO

### Teste 1: Detectar FA
```bash
python src/predict.py data/raw/aftdb/learning-set/n01 -v
```
**Esperado:** ⚠️ Fibrilação Atrial (confiança alta)

### Teste 2: Detectar Normal
```bash
python src/predict.py data/raw/nsrdb/16265 --annotation-ext atr -v
```
**Esperado:** ✅ Ritmo Normal (confiança alta)

### Teste 3: Comparar Probabilidades
```bash
# FA
python src/predict.py data/raw/aftdb/learning-set/n01 -p

# Normal
python src/predict.py data/raw/nsrdb/16272 --annotation-ext atr -p
```
**Esperado:** Probabilidades complementares (FA: 95% vs 5%, Normal: 5% vs 95%)

---

## 🎓 CONCEITOS IMPORTANTES

### O que é Normalização?
Converter features para a mesma escala (média=0, std=1). **Essencial** porque:
- SVM e Logistic Regression são sensíveis à escala
- Features têm unidades diferentes (segundos, %, bpm)
- Modelo foi treinado com dados normalizados

### Por que usar o MESMO scaler?
```python
# ❌ ERRADO - Cria scaler novo
novo_scaler = StandardScaler()
features_norm = novo_scaler.fit_transform(features)

# ✅ CERTO - Usa scaler salvo
scaler_salvo = joblib.load('scaler.pkl')
features_norm = scaler_salvo.transform(features)
```

Cada scaler "aprende" média/desvio diferentes. Usar outro quebra o modelo!

---

## ✅ CHECKLIST DE USO

Antes de usar o pipeline:
- [ ] ✅ Ambiente virtual ativado (`source venv/bin/activate`)
- [ ] ✅ Modelo treinado (`models/best_model.pkl` existe)
- [ ] ✅ Scaler salvo (`models/scaler.pkl` existe)
- [ ] ✅ Arquivo ECG existe (`.dat` + `.hea` + `.qrs/.atr`)

---

## 🎯 PRÓXIMOS PASSOS

Agora que você tem o pipeline funcionando:

1. ✅ **Testar com mais ECGs** do dataset
2. ✅ **Validar resultados** comparando com labels reais
3. ⏳ **Aplicar em dados novos** (fora do dataset)
4. ⏳ **Criar interface gráfica** (se quiser!)
5. ⏳ **Integrar com sistema hospitalar** (produção)

---

## 📞 SUPORTE

Se tiver dúvidas:
1. Execute com `--verbose` para ver detalhes
2. Verifique se os arquivos do modelo existem
3. Teste com exemplos conhecidos primeiro

**Boa sorte! 🚀**
