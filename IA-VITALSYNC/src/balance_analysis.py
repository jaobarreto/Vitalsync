"""
balance_analysis.py
------------------
Script para analisar o desbalanceamento de classes e seu impacto potencial no modelo.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path


def analyze_class_balance(df: pd.DataFrame):
    """
    Analisa o balanceamento de classes no dataset.
    """
    print("=" * 80)
    print("⚖️  ANÁLISE DE BALANCEAMENTO DE CLASSES")
    print("=" * 80)
    
    # Contar classes
    class_counts = df['label'].value_counts().sort_index()
    total = len(df)
    
    print(f"\n📊 DISTRIBUIÇÃO DAS CLASSES:")
    print("-" * 80)
    print(f"  Classe 0 (Ritmo Normal): {class_counts[0]:>3} registros ({class_counts[0]/total*100:>5.1f}%)")
    print(f"  Classe 1 (Fibrilação Atrial): {class_counts[1]:>3} registros ({class_counts[1]/total*100:>5.1f}%)")
    print(f"  Total: {total} registros")
    
    # Calcular razão de desbalanceamento
    minority_class = class_counts.min()
    majority_class = class_counts.max()
    imbalance_ratio = majority_class / minority_class
    
    print(f"\n📐 MÉTRICAS DE DESBALANCEAMENTO:")
    print("-" * 80)
    print(f"  Classe minoritária: {minority_class} registros (Ritmo Normal)")
    print(f"  Classe majoritária: {majority_class} registros (Fibrilação Atrial)")
    print(f"  Razão de desbalanceamento: {imbalance_ratio:.2f}:1")
    
    # Avaliar severidade do desbalanceamento
    print(f"\n🎯 AVALIAÇÃO DO DESBALANCEAMENTO:")
    print("-" * 80)
    
    if imbalance_ratio < 1.5:
        severity = "LEVE"
        color = "🟢"
        impact = "Mínimo - O modelo deve funcionar bem sem ajustes especiais"
    elif imbalance_ratio < 3:
        severity = "MODERADO"
        color = "🟡"
        impact = "Baixo a Médio - Recomendado usar class_weight ou técnicas de balanceamento"
    elif imbalance_ratio < 10:
        severity = "ALTO"
        color = "🟠"
        impact = "Médio a Alto - Necessário usar técnicas de balanceamento (SMOTE, class_weight, etc.)"
    else:
        severity = "SEVERO"
        color = "🔴"
        impact = "Alto - Altamente recomendado usar múltiplas técnicas de balanceamento"
    
    print(f"  {color} Severidade: {severity} ({imbalance_ratio:.2f}:1)")
    print(f"  {color} Impacto esperado: {impact}")
    
    return class_counts, imbalance_ratio


def explain_imbalance_impact():
    """
    Explica o impacto do desbalanceamento no modelo.
    """
    print("\n" + "=" * 80)
    print("🧠 COMO O DESBALANCEAMENTO AFETA O MODELO DE ML")
    print("=" * 80)
    
    print("""
📚 CONCEITO:
   Quando um dataset está desbalanceado, o modelo tende a "favorecer" a classe 
   majoritária porque ela aparece mais nos dados de treino.

🎯 NO NOSSO CASO (80 FA vs 18 Normal):

   PROBLEMA POTENCIAL:
   • O modelo pode ficar "viciado" em prever Fibrilação Atrial
   • Ele pode aprender: "Na dúvida, classifique como FA"
   • Isso dá uma acurácia alta (80%), mas é ENGANOSO!

   ❌ EXEMPLO DE MODELO RUIM:
   
   Imagine um modelo "burro" que SEMPRE prevê FA (label=1):
   
   • Acurácia: 80/98 = 81.6% ✅ (parece ótimo!)
   • MAS ele NUNCA detecta Ritmo Normal ❌
   • Sensibilidade (detectar FA): 100% ✅
   • Especificidade (detectar Normal): 0% ❌ PÉSSIMO!
   
   Este modelo é INÚTIL clinicamente, mas tem "boa acurácia"!

💡 POR QUE ISSO ACONTECE:

   Durante o treinamento, o modelo vê:
   • 80 exemplos de FA → "Aprende bem o que é FA"
   • 18 exemplos de Normal → "Vê pouco e não aprende direito"
   
   Resultado: Ele fica "expert em FA" mas "péssimo em Normal"

🎯 IMPACTO NAS MÉTRICAS:

   ✅ Acurácia: Pode ser enganosa (modelo ruim pode ter 80%+)
   ⚠️  Sensibilidade (Recall para FA): Provavelmente ALTA (bom)
   ❌ Especificidade (detectar Normal): Provavelmente BAIXA (ruim)
   ⚠️  Precisão: Pode ser moderada
   
   É por isso que NÃO podemos confiar apenas na acurácia!
""")


def suggest_solutions(imbalance_ratio: float):
    """
    Sugere soluções para lidar com o desbalanceamento.
    """
    print("\n" + "=" * 80)
    print("💡 SOLUÇÕES PARA O DESBALANCEAMENTO")
    print("=" * 80)
    
    print(f"\nPara uma razão de {imbalance_ratio:.2f}:1, recomendamos:\n")
    
    print("1️⃣  CLASS_WEIGHT='balanced' (MAIS FÁCIL - RECOMENDADO)")
    print("-" * 80)
    print("""
   O QUE FAZ:
   • Dá "pesos" diferentes para cada classe durante o treino
   • Exemplos da classe minoritária (Normal) recebem peso MAIOR
   • Força o modelo a prestar mais atenção nos casos raros
   
   COMO USAR:
   ```python
   from sklearn.ensemble import RandomForestClassifier
   
   # Simples assim!
   modelo = RandomForestClassifier(class_weight='balanced')
   modelo.fit(X_train, y_train)
   ```
   
   VANTAGENS:
   ✅ Fácil de implementar (1 parâmetro!)
   ✅ Funciona bem para desbalanceamento moderado
   ✅ Não precisa gerar dados artificiais
   
   DESVANTAGENS:
   ⚠️  Pode não ser suficiente para desbalanceamento severo (>10:1)
""")
    
    print("\n2️⃣  SMOTE - Synthetic Minority Over-sampling Technique")
    print("-" * 80)
    print("""
   O QUE FAZ:
   • Cria exemplos SINTÉTICOS da classe minoritária
   • Usa interpolação entre exemplos existentes
   • Aumenta o número de casos de Ritmo Normal artificialmente
   
   COMO USAR:
   ```python
   from imblearn.over_sampling import SMOTE
   
   smote = SMOTE(random_state=42)
   X_balanced, y_balanced = smote.fit_resample(X_train, y_train)
   
   # Agora treina com dados balanceados
   modelo.fit(X_balanced, y_balanced)
   ```
   
   VANTAGENS:
   ✅ Aumenta a quantidade de dados da classe minoritária
   ✅ Funciona bem para desbalanceamento alto
   ✅ Modelo vê mais exemplos da classe rara
   
   DESVANTAGENS:
   ⚠️  Pode gerar dados "irrealistas" (overfitting)
   ⚠️  Precisa instalar biblioteca extra (imbalanced-learn)
""")
    
    print("\n3️⃣  UNDERSAMPLING (Reduzir classe majoritária)")
    print("-" * 80)
    print("""
   O QUE FAZ:
   • Remove aleatoriamente exemplos da classe majoritária (FA)
   • Deixa o dataset balanceado (ex: 18 FA vs 18 Normal)
   
   QUANDO USAR:
   • ⚠️  NÃO RECOMENDADO no nosso caso!
   • Perderíamos 62 dos 80 exemplos de FA
   • Com apenas 36 exemplos totais, o modelo ficaria MUITO fraco
   
   VANTAGENS:
   ✅ Balanceamento perfeito
   ✅ Treino mais rápido (menos dados)
   
   DESVANTAGENS:
   ❌ PERDE muitos dados valiosos
   ❌ Modelo treina com menos informação
   ❌ Não recomendado para datasets pequenos como o nosso
""")
    
    print("\n4️⃣  MÉTRICAS APROPRIADAS (ESSENCIAL!)")
    print("-" * 80)
    print("""
   SEMPRE USE:
   • ✅ Sensibilidade (Recall) - Detectar FA corretamente
   • ✅ Especificidade - Detectar Normal corretamente
   • ✅ F1-Score - Balanceia Precisão e Recall
   • ✅ ROC-AUC - Métrica geral robusta a desbalanceamento
   • ✅ Matriz de Confusão - Ver onde o modelo erra
   
   EVITE:
   • ❌ Acurácia sozinha (é enganosa!)
""")
    
    print("\n5️⃣  STRATIFIED K-FOLD (Para validação)")
    print("-" * 80)
    print("""
   O QUE FAZ:
   • Divide dados de treino/teste mantendo a proporção de classes
   • Garante que ambas as classes aparecem no teste
   
   COMO USAR:
   ```python
   from sklearn.model_selection import train_test_split
   
   # stratify=y mantém a proporção de classes
   X_train, X_test, y_train, y_test = train_test_split(
       X, y, test_size=0.2, stratify=y, random_state=42
   )
   ```
   
   VANTAGENS:
   ✅ Garante representação justa de ambas as classes
   ✅ Avaliação mais confiável
""")


def recommend_approach(imbalance_ratio: float):
    """
    Recomenda a melhor abordagem para o projeto.
    """
    print("\n" + "=" * 80)
    print("🎯 RECOMENDAÇÃO PARA O SEU PROJETO")
    print("=" * 80)
    
    print(f"""
Dado que temos uma razão de {imbalance_ratio:.2f}:1, recomendo a seguinte estratégia:

📋 PLANO DE AÇÃO:

1. ✅ USAR class_weight='balanced'
   → Aplicar em TODOS os modelos (Random Forest, SVM, etc.)
   → É simples e eficaz para nosso nível de desbalanceamento

2. ✅ USAR stratify no train_test_split
   → Garante que o conjunto de teste seja representativo

3. ✅ AVALIAR com métricas apropriadas
   → Sensibilidade, Especificidade, F1-Score, ROC-AUC
   → NÃO confiar apenas na acurácia

4. ⏳ TESTAR SMOTE (opcional)
   → Se class_weight não for suficiente
   → Comparar resultados com e sem SMOTE

5. ✅ CRIAR matriz de confusão detalhada
   → Ver exatamente onde o modelo erra
   → Verificar se ele "vicia" em prever FA

📊 EXPECTATIVA REALISTA:

Com class_weight='balanced':
• ✅ Sensibilidade (detectar FA): 85-95%
• ✅ Especificidade (detectar Normal): 70-85%
• ✅ ROC-AUC: 0.85-0.95

Sem balanceamento:
• ✅ Sensibilidade (detectar FA): 95-100% (muito alta)
• ❌ Especificidade (detectar Normal): 30-50% (ruim!)
• ⚠️  ROC-AUC: 0.70-0.80 (moderado)

🎓 CONCLUSÃO:

O desbalanceamento de {imbalance_ratio:.2f}:1 é GERENCIÁVEL com as técnicas certas!
NÃO é severo o suficiente para impedir bons resultados.

A chave é:
1. Usar class_weight='balanced'
2. Avaliar com métricas corretas
3. Não confiar só na acurácia

Vamos implementar isso no próximo passo! 🚀
""")


def visualize_imbalance(df: pd.DataFrame):
    """
    Cria visualizações do desbalanceamento.
    """
    print("\n" + "=" * 80)
    print("📊 GERANDO VISUALIZAÇÕES...")
    print("=" * 80)
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Gráfico de barras
    class_counts = df['label'].value_counts().sort_index()
    labels_text = ['Ritmo Normal\n(Classe 0)', 'Fibrilação Atrial\n(Classe 1)']
    colors = ['#2ecc71', '#e74c3c']
    
    axes[0].bar(labels_text, class_counts.values, color=colors, edgecolor='black', linewidth=2)
    axes[0].set_ylabel('Número de Registros', fontsize=12)
    axes[0].set_title('Distribuição de Classes', fontsize=14, fontweight='bold')
    axes[0].grid(True, alpha=0.3, axis='y')
    
    # Adicionar números nas barras
    for i, (label, count) in enumerate(zip(labels_text, class_counts.values)):
        axes[0].text(i, count + 2, f'{count}\n({count/len(df)*100:.1f}%)', 
                    ha='center', fontsize=11, fontweight='bold')
    
    # Gráfico de pizza
    axes[1].pie(class_counts.values, labels=labels_text, autopct='%1.1f%%',
               colors=colors, startangle=90, textprops={'fontsize': 11, 'fontweight': 'bold'},
               wedgeprops={'edgecolor': 'black', 'linewidth': 2})
    axes[1].set_title('Proporção de Classes', fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    
    # Salvar figura
    output_dir = Path(__file__).parent.parent / 'reports' / 'figures'
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / 'class_imbalance.png'
    plt.savefig(output_file, dpi=150, bbox_inches='tight')
    print(f"\n💾 Visualização salva em: {output_file}")
    
    plt.show()


if __name__ == "__main__":
    # Carregar dados
    features_path = Path(__file__).parent.parent / 'data' / 'processed' / 'features.csv'
    df = pd.read_csv(features_path)
    
    # Análise
    class_counts, imbalance_ratio = analyze_class_balance(df)
    explain_imbalance_impact()
    suggest_solutions(imbalance_ratio)
    recommend_approach(imbalance_ratio)
    visualize_imbalance(df)
    
    print("\n" + "=" * 80)
    print("✅ ANÁLISE COMPLETA!")
    print("=" * 80)
