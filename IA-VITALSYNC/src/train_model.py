"""
train_model.py
--------------
Script para treinar e avaliar modelos de classificação de ECG.
Implementa técnicas para lidar com desbalanceamento de classes.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import joblib
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    roc_curve, auc
)


def load_and_prepare_data(features_path: Path):
    """
    Carrega e prepara os dados para treinamento.
    """
    print("=" * 80)
    print("📂 CARREGANDO DADOS")
    print("=" * 80)
    
    df = pd.read_csv(features_path)
    print(f"\n✅ Dataset carregado: {len(df)} registros")
    print(f"   - Classe 0 (Normal): {(df['label']==0).sum()} registros")
    print(f"   - Classe 1 (FA): {(df['label']==1).sum()} registros")
    
    # Separar features e labels
    # Remover colunas não-features
    feature_cols = [col for col in df.columns 
                   if col not in ['label', 'record_name', 'dataset', 'subset']]
    
    X = df[feature_cols].values
    y = df['label'].values
    
    print(f"\n📊 Features selecionadas: {len(feature_cols)}")
    print(f"   {', '.join(feature_cols[:5])}...")
    
    return X, y, feature_cols, df


def split_and_scale_data(X, y, test_size=0.2, random_state=42):
    """
    Divide os dados em treino/teste e normaliza.
    """
    print("\n" + "=" * 80)
    print("✂️  DIVIDINDO E NORMALIZANDO DADOS")
    print("=" * 80)
    
    # Divisão estratificada (mantém proporção de classes)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    print(f"\n📦 Conjunto de TREINO:")
    print(f"   - Total: {len(y_train)} registros")
    print(f"   - Classe 0 (Normal): {(y_train==0).sum()} ({(y_train==0).sum()/len(y_train)*100:.1f}%)")
    print(f"   - Classe 1 (FA): {(y_train==1).sum()} ({(y_train==1).sum()/len(y_train)*100:.1f}%)")
    
    print(f"\n📦 Conjunto de TESTE:")
    print(f"   - Total: {len(y_test)} registros")
    print(f"   - Classe 0 (Normal): {(y_test==0).sum()} ({(y_test==0).sum()/len(y_test)*100:.1f}%)")
    print(f"   - Classe 1 (FA): {(y_test==1).sum()} ({(y_test==1).sum()/len(y_test)*100:.1f}%)")
    
    # Normalização (importante para SVM e Logistic Regression)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"\n🔄 Dados normalizados (StandardScaler)")
    print(f"   - Média antes: {X_train.mean():.2f} → Depois: {X_train_scaled.mean():.2f}")
    print(f"   - Std antes: {X_train.std():.2f} → Depois: {X_train_scaled.std():.2f}")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def train_models(X_train, y_train):
    """
    Treina múltiplos modelos com class_weight='balanced'.
    """
    print("\n" + "=" * 80)
    print("🤖 TREINANDO MODELOS (com class_weight='balanced')")
    print("=" * 80)
    
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        ),
        'SVM (RBF)': SVC(
            kernel='rbf',
            class_weight='balanced',
            probability=True,
            random_state=42
        ),
        'Logistic Regression': LogisticRegression(
            class_weight='balanced',
            max_iter=1000,
            random_state=42
        )
    }
    
    trained_models = {}
    
    for name, model in models.items():
        print(f"\n🔧 Treinando {name}...")
        model.fit(X_train, y_train)
        trained_models[name] = model
        print(f"   ✅ {name} treinado!")
    
    return trained_models


def calculate_metrics(y_true, y_pred, y_pred_proba):
    """
    Calcula todas as métricas relevantes.
    """
    # Matriz de confusão
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    # Métricas básicas
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)  # Sensibilidade
    f1 = f1_score(y_true, y_pred)
    roc_auc = roc_auc_score(y_true, y_pred_proba)
    
    # Especificidade (TN / (TN + FP))
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'sensitivity': recall,  # Recall = Sensibilidade
        'specificity': specificity,
        'f1_score': f1,
        'roc_auc': roc_auc,
        'confusion_matrix': {'tn': tn, 'fp': fp, 'fn': fn, 'tp': tp}
    }


def evaluate_models(models, X_test, y_test):
    """
    Avalia todos os modelos e retorna métricas.
    """
    print("\n" + "=" * 80)
    print("📊 AVALIAÇÃO DOS MODELOS")
    print("=" * 80)
    
    results = {}
    
    for name, model in models.items():
        print(f"\n{'=' * 80}")
        print(f"🔍 Avaliando: {name}")
        print(f"{'=' * 80}")
        
        # Predições
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Calcular métricas
        metrics = calculate_metrics(y_test, y_pred, y_pred_proba)
        results[name] = metrics
        
        # Exibir resultados
        print(f"\n📈 MÉTRICAS:")
        print(f"   Acurácia:        {metrics['accuracy']:.3f} ({metrics['accuracy']*100:.1f}%)")
        print(f"   Sensibilidade:   {metrics['sensitivity']:.3f} ({metrics['sensitivity']*100:.1f}%) - Detectar FA")
        print(f"   Especificidade:  {metrics['specificity']:.3f} ({metrics['specificity']*100:.1f}%) - Detectar Normal")
        print(f"   Precisão:        {metrics['precision']:.3f} ({metrics['precision']*100:.1f}%)")
        print(f"   F1-Score:        {metrics['f1_score']:.3f}")
        print(f"   ROC-AUC:         {metrics['roc_auc']:.3f}")
        
        # Matriz de confusão
        cm = metrics['confusion_matrix']
        print(f"\n🔢 MATRIZ DE CONFUSÃO:")
        print(f"                Predito: Normal  |  Predito: FA")
        print(f"   Real: Normal    {cm['tn']:>4} (TN)      |  {cm['fp']:>4} (FP)")
        print(f"   Real: FA        {cm['fn']:>4} (FN)      |  {cm['tp']:>4} (TP)")
        
        # Interpretação
        print(f"\n💡 INTERPRETAÇÃO:")
        if metrics['sensitivity'] > 0.85 and metrics['specificity'] > 0.70:
            print(f"   ✅ EXCELENTE! Bom equilíbrio entre detectar FA e Normal")
        elif metrics['sensitivity'] > 0.90 and metrics['specificity'] < 0.60:
            print(f"   ⚠️  VIÉS para FA: Ótimo em detectar FA, mas perde muitos Normais")
        elif metrics['sensitivity'] < 0.75:
            print(f"   ⚠️  SENSIBILIDADE BAIXA: Não detecta bem os casos de FA")
        else:
            print(f"   ✅ BOM: Desempenho razoável, mas pode melhorar")
    
    return results


def plot_comparison(results, output_dir):
    """
    Cria gráficos comparando os modelos.
    """
    print("\n" + "=" * 80)
    print("📊 GERANDO VISUALIZAÇÕES COMPARATIVAS")
    print("=" * 80)
    
    # Preparar dados para plotagem
    models_names = list(results.keys())
    metrics_names = ['accuracy', 'sensitivity', 'specificity', 'f1_score', 'roc_auc']
    metrics_labels = ['Acurácia', 'Sensibilidade\n(Detectar FA)', 
                     'Especificidade\n(Detectar Normal)', 'F1-Score', 'ROC-AUC']
    
    # Criar figura
    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    fig.suptitle('Comparação de Modelos - Métricas de Desempenho', 
                 fontsize=16, fontweight='bold', y=0.995)
    
    # Gráfico 1: Comparação de todas as métricas
    ax = axes[0, 0]
    x = np.arange(len(metrics_names))
    width = 0.25
    
    for i, model_name in enumerate(models_names):
        values = [results[model_name][metric] for metric in metrics_names]
        ax.bar(x + i*width, values, width, label=model_name, alpha=0.8)
    
    ax.set_ylabel('Score', fontsize=11)
    ax.set_title('Todas as Métricas', fontsize=12, fontweight='bold')
    ax.set_xticks(x + width)
    ax.set_xticklabels(metrics_labels, fontsize=9)
    ax.legend(fontsize=9)
    ax.grid(True, alpha=0.3, axis='y')
    ax.set_ylim([0, 1.05])
    
    # Gráfico 2: Sensibilidade vs Especificidade
    ax = axes[0, 1]
    for model_name in models_names:
        sens = results[model_name]['sensitivity']
        spec = results[model_name]['specificity']
        ax.scatter(spec, sens, s=200, alpha=0.7, label=model_name)
        ax.text(spec + 0.02, sens, model_name, fontsize=9)
    
    ax.set_xlabel('Especificidade (Detectar Normal)', fontsize=11)
    ax.set_ylabel('Sensibilidade (Detectar FA)', fontsize=11)
    ax.set_title('Trade-off Sensibilidade vs Especificidade', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xlim([0, 1.05])
    ax.set_ylim([0, 1.05])
    ax.plot([0, 1], [0, 1], 'k--', alpha=0.3, label='Linha de base')
    
    # Gráfico 3: ROC-AUC
    ax = axes[0, 2]
    colors = ['#3498db', '#e74c3c', '#2ecc71']
    for i, model_name in enumerate(models_names):
        roc_auc = results[model_name]['roc_auc']
        ax.barh(model_name, roc_auc, color=colors[i], alpha=0.7, edgecolor='black')
        ax.text(roc_auc + 0.02, i, f'{roc_auc:.3f}', va='center', fontweight='bold')
    
    ax.set_xlabel('ROC-AUC Score', fontsize=11)
    ax.set_title('ROC-AUC por Modelo', fontsize=12, fontweight='bold')
    ax.set_xlim([0, 1.1])
    ax.grid(True, alpha=0.3, axis='x')
    
    # Gráficos 4-6: Matrizes de Confusão
    for idx, model_name in enumerate(models_names):
        ax = axes[1, idx]
        cm = results[model_name]['confusion_matrix']
        cm_matrix = np.array([[cm['tn'], cm['fp']], 
                             [cm['fn'], cm['tp']]])
        
        sns.heatmap(cm_matrix, annot=True, fmt='d', cmap='Blues', 
                   cbar=False, ax=ax, square=True,
                   xticklabels=['Normal', 'FA'],
                   yticklabels=['Normal', 'FA'])
        
        ax.set_ylabel('Real', fontsize=11)
        ax.set_xlabel('Predito', fontsize=11)
        ax.set_title(f'Matriz de Confusão - {model_name}', 
                    fontsize=11, fontweight='bold')
    
    plt.tight_layout()
    
    # Salvar
    output_file = output_dir / 'model_comparison.png'
    plt.savefig(output_file, dpi=150, bbox_inches='tight')
    print(f"\n💾 Visualização salva em: {output_file}")
    
    plt.show()


def save_best_model(models, results, output_dir):
    """
    Salva o melhor modelo baseado em ROC-AUC.
    """
    print("\n" + "=" * 80)
    print("💾 SALVANDO MELHOR MODELO")
    print("=" * 80)
    
    # Encontrar melhor modelo por ROC-AUC
    best_model_name = max(results.keys(), key=lambda k: results[k]['roc_auc'])
    best_model = models[best_model_name]
    best_roc_auc = results[best_model_name]['roc_auc']
    
    print(f"\n🏆 Melhor modelo: {best_model_name}")
    print(f"   ROC-AUC: {best_roc_auc:.3f}")
    
    # Salvar modelo
    model_file = output_dir / 'best_model.pkl'
    joblib.dump(best_model, model_file)
    print(f"\n✅ Modelo salvo em: {model_file}")
    
    # Salvar informações do modelo
    info_file = output_dir / 'model_info.txt'
    with open(info_file, 'w') as f:
        f.write(f"Melhor Modelo: {best_model_name}\n")
        f.write(f"ROC-AUC: {best_roc_auc:.3f}\n")
        f.write(f"\nMétricas completas:\n")
        for metric, value in results[best_model_name].items():
            if metric != 'confusion_matrix':
                f.write(f"  {metric}: {value:.3f}\n")
    
    print(f"✅ Informações salvas em: {info_file}")
    
    return best_model_name, best_model


def print_summary(results):
    """
    Imprime resumo final.
    """
    print("\n" + "=" * 80)
    print("📋 RESUMO FINAL")
    print("=" * 80)
    
    print("\n🎯 RANKING DOS MODELOS (por ROC-AUC):")
    sorted_models = sorted(results.items(), 
                          key=lambda x: x[1]['roc_auc'], 
                          reverse=True)
    
    for i, (name, metrics) in enumerate(sorted_models, 1):
        print(f"\n   {i}º {name}")
        print(f"      ROC-AUC: {metrics['roc_auc']:.3f}")
        print(f"      Sensibilidade: {metrics['sensitivity']:.3f} | Especificidade: {metrics['specificity']:.3f}")
        print(f"      F1-Score: {metrics['f1_score']:.3f}")
    
    print("\n" + "=" * 80)
    print("✅ TREINAMENTO CONCLUÍDO COM SUCESSO!")
    print("=" * 80)
    
    print("""
💡 PRÓXIMOS PASSOS:

1. ✅ Modelos treinados com class_weight='balanced'
2. ✅ Métricas apropriadas calculadas
3. ⏳ Se a especificidade estiver baixa (<70%), considere testar SMOTE
4. ⏳ Criar pipeline de predição (predict.py)
5. ⏳ Testar com novos dados reais

🎓 LEMBRE-SE:
   - Sensibilidade alta = Boa detecção de FA
   - Especificidade alta = Boa detecção de Normal
   - ROC-AUC > 0.85 = Excelente desempenho geral
""")


if __name__ == "__main__":
    # Caminhos
    project_root = Path(__file__).parent.parent
    features_path = project_root / 'data' / 'processed' / 'features.csv'
    models_dir = project_root / 'models'
    figures_dir = project_root / 'reports' / 'figures'
    
    # Criar diretórios
    models_dir.mkdir(parents=True, exist_ok=True)
    figures_dir.mkdir(parents=True, exist_ok=True)
    
    # Pipeline completo
    X, y, feature_cols, df = load_and_prepare_data(features_path)
    X_train, X_test, y_train, y_test, scaler = split_and_scale_data(X, y)
    
    # Salvar scaler
    scaler_file = models_dir / 'scaler.pkl'
    joblib.dump(scaler, scaler_file)
    print(f"\n💾 Scaler salvo em: {scaler_file}")
    
    # Treinar modelos
    models = train_models(X_train, y_train)
    
    # Avaliar modelos
    results = evaluate_models(models, X_test, y_test)
    
    # Visualizações
    plot_comparison(results, figures_dir)
    
    # Salvar melhor modelo
    best_model_name, best_model = save_best_model(models, results, models_dir)
    
    # Resumo
    print_summary(results)
