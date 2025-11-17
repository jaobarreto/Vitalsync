"""
test_predictions.py
-------------------
Script para testar o pipeline de predição com amostras aleatórias do dataset.
Valida se o modelo está acertando comparando predições com labels reais.
"""

import random
import pandas as pd
from pathlib import Path
import joblib
import numpy as np
from feature_extraction import extract_features_from_record


def load_dataset_info():
    """
    Carrega o CSV com features e labels reais.
    """
    features_path = Path(__file__).parent.parent / 'data' / 'processed' / 'features.csv'
    df = pd.read_csv(features_path)
    return df


def get_random_samples(df, n_samples=10, seed=42):
    """
    Seleciona amostras aleatórias do dataset (balanceadas por classe).
    """
    random.seed(seed)
    np.random.seed(seed)
    
    # Separar por classe
    fa_records = df[df['label'] == 1].copy()
    normal_records = df[df['label'] == 0].copy()
    
    # Pegar metade de cada classe
    n_per_class = n_samples // 2
    
    fa_samples = fa_records.sample(n=min(n_per_class, len(fa_records)), random_state=seed)
    normal_samples = normal_records.sample(n=min(n_per_class, len(normal_records)), random_state=seed)
    
    # Combinar e embaralhar
    samples = pd.concat([fa_samples, normal_samples])
    samples = samples.sample(frac=1, random_state=seed).reset_index(drop=True)
    
    return samples


def build_record_path(row):
    """
    Constrói o caminho completo do arquivo a partir de dataset/subset/record_name.
    """
    project_root = Path(__file__).parent.parent
    
    dataset = row['dataset']
    record_name = row['record_name']
    
    if dataset == 'aftdb':
        subset = row['subset']
        return project_root / 'data' / 'raw' / 'aftdb' / subset / record_name
    else:  # nsrdb
        return project_root / 'data' / 'raw' / 'nsrdb' / record_name


def get_annotation_ext(dataset):
    """
    Retorna a extensão de anotação baseada no dataset.
    """
    return 'qrs' if dataset == 'aftdb' else 'atr'


def predict_record(record_path, annotation_ext, model, scaler):
    """
    Faz predição em um registro.
    """
    # Extrair features
    features_dict = extract_features_from_record(
        str(record_path), 
        label=None,
        annotation_ext=annotation_ext
    )
    
    # Preparar vetor de features (mesma ordem do treinamento)
    feature_names = [
        'num_beats', 'num_rr_intervals', 'sampling_freq',
        'rr_mean', 'rr_std', 'rr_median', 'rr_min', 'rr_max',
        'rr_cv', 'rr_rmssd', 'rr_range',
        'rr_percentile_25', 'rr_percentile_75', 'rr_iqr',
        'mean_hr_bpm'
    ]
    
    features_vector = np.array([[features_dict[name] for name in feature_names]])
    
    # Normalizar
    features_normalized = scaler.transform(features_vector)
    
    # Prever
    prediction = model.predict(features_normalized)[0]
    probabilities = model.predict_proba(features_normalized)[0]
    
    return {
        'prediction': prediction,
        'confidence': probabilities[prediction] * 100,
        'proba_normal': probabilities[0] * 100,
        'proba_fa': probabilities[1] * 100,
        'rr_cv': features_dict['rr_cv']
    }


def run_tests(n_samples=10, verbose=True):
    """
    Executa testes com amostras aleatórias.
    """
    print("=" * 80)
    print("🧪 TESTE DO PIPELINE DE PREDIÇÃO")
    print("=" * 80)
    print(f"\n📊 Testando com {n_samples} amostras aleatórias do dataset...")
    
    # Carregar dataset
    df = load_dataset_info()
    print(f"✅ Dataset carregado: {len(df)} registros totais")
    print(f"   - {(df['label']==0).sum()} Normais | {(df['label']==1).sum()} FA")
    
    # Selecionar amostras
    samples = get_random_samples(df, n_samples=n_samples)
    print(f"\n✅ Selecionadas {len(samples)} amostras aleatórias:")
    print(f"   - {(samples['label']==0).sum()} Normais | {(samples['label']==1).sum()} FA")
    
    # Carregar modelo e scaler
    models_dir = Path(__file__).parent.parent / 'models'
    model = joblib.load(models_dir / 'best_model.pkl')
    scaler = joblib.load(models_dir / 'scaler.pkl')
    print(f"\n✅ Modelo e scaler carregados")
    
    # Testar cada amostra
    print(f"\n{'=' * 80}")
    print(f"🔍 TESTANDO PREDIÇÕES...")
    print(f"{'=' * 80}\n")
    
    results = []
    correct = 0
    
    for idx, row in samples.iterrows():
        record_name = row['record_name']
        true_label = row['label']
        true_class = 'FA' if true_label == 1 else 'Normal'
        dataset = row['dataset']
        
        # Construir caminho
        record_path = build_record_path(row)
        annotation_ext = get_annotation_ext(dataset)
        
        # Fazer predição
        try:
            pred_result = predict_record(record_path, annotation_ext, model, scaler)
            pred_label = pred_result['prediction']
            pred_class = 'FA' if pred_label == 1 else 'Normal'
            confidence = pred_result['confidence']
            rr_cv = pred_result['rr_cv']
            
            # Verificar se acertou
            is_correct = (pred_label == true_label)
            if is_correct:
                correct += 1
            
            # Armazenar resultado
            results.append({
                'record': record_name,
                'dataset': dataset,
                'true_label': true_class,
                'predicted': pred_class,
                'correct': is_correct,
                'confidence': confidence,
                'rr_cv': rr_cv
            })
            
            # Exibir resultado
            status = "✅" if is_correct else "❌"
            print(f"{status} {record_name:20} | Real: {true_class:6} | Predito: {pred_class:6} | "
                  f"Confiança: {confidence:5.1f}% | CV: {rr_cv:6.2f}%")
            
            if verbose and not is_correct:
                print(f"   ⚠️  ERRO! Esperava {true_class}, mas previu {pred_class}")
                print(f"   Probabilidades: Normal={pred_result['proba_normal']:.1f}% | FA={pred_result['proba_fa']:.1f}%")
        
        except Exception as e:
            print(f"❌ {record_name:20} | ERRO: {str(e)}")
            results.append({
                'record': record_name,
                'dataset': dataset,
                'true_label': true_class,
                'predicted': 'ERROR',
                'correct': False,
                'confidence': 0,
                'rr_cv': 0
            })
    
    # Calcular estatísticas
    print(f"\n{'=' * 80}")
    print(f"📊 RESULTADOS FINAIS")
    print(f"{'=' * 80}")
    
    accuracy = (correct / len(samples)) * 100
    
    print(f"\n🎯 ACURÁCIA GERAL:")
    print(f"   Acertos: {correct}/{len(samples)}")
    print(f"   Acurácia: {accuracy:.1f}%")
    
    # Analisar por classe
    results_df = pd.DataFrame(results)
    results_df = results_df[results_df['predicted'] != 'ERROR']
    
    if len(results_df) > 0:
        print(f"\n📈 ACURÁCIA POR CLASSE:")
        
        # Normal
        normal_results = results_df[results_df['true_label'] == 'Normal']
        if len(normal_results) > 0:
            normal_acc = (normal_results['correct'].sum() / len(normal_results)) * 100
            print(f"   Normal: {normal_results['correct'].sum()}/{len(normal_results)} "
                  f"({normal_acc:.1f}%)")
        
        # FA
        fa_results = results_df[results_df['true_label'] == 'FA']
        if len(fa_results) > 0:
            fa_acc = (fa_results['correct'].sum() / len(fa_results)) * 100
            print(f"   FA: {fa_results['correct'].sum()}/{len(fa_results)} "
                  f"({fa_acc:.1f}%)")
        
        # Confiança média
        print(f"\n💪 CONFIANÇA MÉDIA:")
        correct_preds = results_df[results_df['correct'] == True]
        incorrect_preds = results_df[results_df['correct'] == False]
        
        if len(correct_preds) > 0:
            print(f"   Predições corretas: {correct_preds['confidence'].mean():.1f}%")
        if len(incorrect_preds) > 0:
            print(f"   Predições incorretas: {incorrect_preds['confidence'].mean():.1f}%")
        
        # Análise de erros
        if len(incorrect_preds) > 0:
            print(f"\n⚠️  ANÁLISE DE ERROS:")
            print(f"   Total de erros: {len(incorrect_preds)}")
            
            for _, error in incorrect_preds.iterrows():
                print(f"   • {error['record']}: Real={error['true_label']}, "
                      f"Previu={error['predicted']}, CV={error['rr_cv']:.2f}%")
    
    # Conclusão
    print(f"\n{'=' * 80}")
    print(f"🎓 CONCLUSÃO:")
    print(f"{'=' * 80}")
    
    if accuracy == 100:
        print(f"   ✅ PERFEITO! O modelo acertou 100% das predições!")
        print(f"   ✅ Tanto FA quanto Normal foram detectados corretamente!")
    elif accuracy >= 90:
        print(f"   ✅ EXCELENTE! Acurácia de {accuracy:.1f}%")
        print(f"   ⚠️  Alguns erros encontrados - revisar casos limítrofes")
    elif accuracy >= 80:
        print(f"   ⚠️  BOM, mas pode melhorar. Acurácia de {accuracy:.1f}%")
        print(f"   ⚠️  Considere analisar os erros e ajustar o modelo")
    else:
        print(f"   ❌ ATENÇÃO! Acurácia baixa ({accuracy:.1f}%)")
        print(f"   ❌ Revisar pipeline e modelo")
    
    print(f"\n{'=' * 80}")
    
    return results_df


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Testar pipeline de predição com amostras aleatórias')
    parser.add_argument('--n-samples', type=int, default=20, 
                       help='Número de amostras para testar (padrão: 20)')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Mostrar detalhes dos erros')
    parser.add_argument('--seed', type=int, default=42,
                       help='Seed para reprodutibilidade (padrão: 42)')
    
    args = parser.parse_args()
    
    # Configurar seed global
    random.seed(args.seed)
    np.random.seed(args.seed)
    
    # Executar testes
    results = run_tests(n_samples=args.n_samples, verbose=args.verbose)
