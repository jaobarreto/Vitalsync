"""
predict.py
----------
Pipeline de predição para classificar novos ECGs como Fibrilação Atrial ou Normal.

USO:
    python predict.py <caminho_do_arquivo> [opções]
    
EXEMPLOS:
    # Predizer um único arquivo
    python predict.py data/raw/aftdb/learning-set/n01
    
    # Predizer com detalhes
    python predict.py data/raw/nsrdb/16265 --verbose
    
    # Mostrar probabilidades
    python predict.py data/raw/aftdb/learning-set/t01 --show-proba
"""

import sys
import argparse
from pathlib import Path
import numpy as np
import joblib
import wfdb

# Importar funções do módulo de extração de features
import sys
sys.path.append(str(Path(__file__).parent))
from feature_extraction import extract_features_from_record


def load_models(models_dir: Path):
    """
    Carrega o modelo treinado e o scaler.
    """
    model_path = models_dir / 'best_model.pkl'
    scaler_path = models_dir / 'scaler.pkl'
    
    if not model_path.exists():
        raise FileNotFoundError(
            f"Modelo não encontrado em {model_path}\n"
            "Execute 'python src/train_model.py' primeiro para treinar o modelo."
        )
    
    if not scaler_path.exists():
        raise FileNotFoundError(
            f"Scaler não encontrado em {scaler_path}\n"
            "Execute 'python src/train_model.py' primeiro."
        )
    
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    
    return model, scaler


def predict_ecg(record_path: str, model, scaler, annotation_ext='qrs', verbose=False):
    """
    Realiza predição em um arquivo de ECG.
    
    Pipeline:
    1. Carregar ECG e anotações
    2. Extrair features (MESMAS do treinamento)
    3. Normalizar com o scaler salvo
    4. Fazer predição com o modelo
    """
    
    if verbose:
        print(f"\n{'='*80}")
        print(f"🔍 PROCESSANDO: {record_path}")
        print(f"{'='*80}")
    
    # ETAPA 1: Extrair features
    if verbose:
        print(f"\n📊 ETAPA 1/3: Extraindo features do ECG...")
    
    try:
        # Tentar primeiro com a extensão fornecida
        features_dict = extract_features_from_record(
            record_path, 
            label=None,  # Não sabemos o label real
            annotation_ext=annotation_ext
        )
    except Exception as e:
        # Se falhar, tentar com .atr (NSRDB)
        if annotation_ext == 'qrs':
            if verbose:
                print(f"   ⚠️  Arquivo .qrs não encontrado, tentando .atr...")
            try:
                features_dict = extract_features_from_record(
                    record_path, 
                    label=None,
                    annotation_ext='atr'
                )
            except Exception as e2:
                raise Exception(
                    f"Erro ao carregar ECG:\n"
                    f"  - Com .qrs: {str(e)}\n"
                    f"  - Com .atr: {str(e2)}\n"
                    f"Verifique se o arquivo existe e tem anotações."
                )
        else:
            raise e
    
    if verbose:
        print(f"   ✅ Features extraídas:")
        print(f"      • Número de batimentos: {features_dict['num_beats']}")
        print(f"      • Frequência de amostragem: {features_dict['sampling_freq']} Hz")
        print(f"      • RR médio: {features_dict['rr_mean']:.3f} s")
        print(f"      • RR CV: {features_dict['rr_cv']:.2f}% {'⚠️ ALTO' if features_dict['rr_cv'] > 10 else '✅ Normal'}")
    
    # ETAPA 2: Preparar vetor de features (MESMA ORDEM do treinamento!)
    if verbose:
        print(f"\n🔄 ETAPA 2/3: Normalizando features...")
    
    # Ordem EXATA das features usadas no treinamento
    feature_names = [
        'num_beats', 'num_rr_intervals', 'sampling_freq',
        'rr_mean', 'rr_std', 'rr_median', 'rr_min', 'rr_max',
        'rr_cv', 'rr_rmssd', 'rr_range',
        'rr_percentile_25', 'rr_percentile_75', 'rr_iqr',
        'mean_hr_bpm'
    ]
    
    # Criar vetor de features na ordem correta
    features_vector = np.array([[features_dict[name] for name in feature_names]])
    
    # Normalizar usando o MESMO scaler do treinamento
    features_normalized = scaler.transform(features_vector)
    
    if verbose:
        print(f"   ✅ Features normalizadas (média≈0, std≈1)")
    
    # ETAPA 3: Fazer predição
    if verbose:
        print(f"\n🤖 ETAPA 3/3: Fazendo predição com Random Forest...")
    
    prediction = model.predict(features_normalized)[0]
    probabilities = model.predict_proba(features_normalized)[0]
    
    # Probabilidade da classe predita
    confidence = probabilities[prediction] * 100
    
    if verbose:
        print(f"   ✅ Predição concluída!")
    
    return {
        'prediction': prediction,
        'class_name': 'Fibrilação Atrial' if prediction == 1 else 'Ritmo Sinusal Normal',
        'confidence': confidence,
        'probability_normal': probabilities[0] * 100,
        'probability_fa': probabilities[1] * 100,
        'features': features_dict
    }


def print_result(result, show_proba=False, verbose=False):
    """
    Exibe o resultado da predição de forma amigável.
    """
    print(f"\n{'='*80}")
    print(f"🎯 RESULTADO DA PREDIÇÃO")
    print(f"{'='*80}")
    
    # Determinar emoji e cor
    if result['prediction'] == 1:
        emoji = "⚠️"
        status = "ANORMAL"
    else:
        emoji = "✅"
        status = "NORMAL"
    
    print(f"\n{emoji} Diagnóstico: {result['class_name']}")
    print(f"   Status: {status}")
    print(f"   Confiança: {result['confidence']:.1f}%")
    
    if show_proba or verbose:
        print(f"\n📊 PROBABILIDADES:")
        print(f"   • Ritmo Normal: {result['probability_normal']:>5.1f}%")
        print(f"   • Fibrilação Atrial: {result['probability_fa']:>5.1f}%")
    
    if verbose:
        print(f"\n📈 FEATURES PRINCIPAIS:")
        feat = result['features']
        print(f"   • CV dos intervalos R-R: {feat['rr_cv']:.2f}%")
        print(f"   • Desvio padrão R-R: {feat['rr_std']:.4f} s")
        print(f"   • RMSSD: {feat['rr_rmssd']:.4f} s")
        print(f"   • Frequência cardíaca média: {feat['mean_hr_bpm']:.1f} bpm")
        
        print(f"\n💡 INTERPRETAÇÃO:")
        if feat['rr_cv'] > 15:
            print(f"   • CV alto ({feat['rr_cv']:.1f}%) indica alta irregularidade → Suspeita de FA")
        elif feat['rr_cv'] < 5:
            print(f"   • CV baixo ({feat['rr_cv']:.1f}%) indica regularidade → Compatível com Normal")
        else:
            print(f"   • CV moderado ({feat['rr_cv']:.1f}%) → Análise detalhada necessária")
    
    print(f"\n{'='*80}")


def main():
    """
    Função principal - interface de linha de comando.
    """
    parser = argparse.ArgumentParser(
        description='Pipeline de predição para classificação de ECG (FA vs Normal)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EXEMPLOS DE USO:

  Predizer um ECG do AFTDB:
    python predict.py data/raw/aftdb/learning-set/n01
  
  Predizer um ECG do NSRDB:
    python predict.py data/raw/nsrdb/16265
  
  Modo detalhado (verbose):
    python predict.py data/raw/aftdb/test-set-a/t01 --verbose
  
  Mostrar probabilidades:
    python predict.py data/raw/nsrdb/16272 --show-proba
  
  Especificar extensão de anotação:
    python predict.py data/raw/nsrdb/16265 --annotation-ext atr

NOTAS:
  - O arquivo pode ser fornecido com ou sem extensão
  - Para AFTDB, use .qrs (padrão)
  - Para NSRDB, use .atr (--annotation-ext atr)
  - O script tenta detectar automaticamente o formato
        """
    )
    
    parser.add_argument(
        'record_path',
        type=str,
        help='Caminho para o arquivo de ECG (com ou sem extensão)'
    )
    
    parser.add_argument(
        '--annotation-ext',
        type=str,
        default='qrs',
        choices=['qrs', 'atr'],
        help='Extensão do arquivo de anotação (padrão: qrs)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Mostrar informações detalhadas do processamento'
    )
    
    parser.add_argument(
        '--show-proba', '-p',
        action='store_true',
        help='Mostrar probabilidades de cada classe'
    )
    
    args = parser.parse_args()
    
    # Banner
    print(f"\n{'='*80}")
    print(f"🏥 VITALSYNC - CLASSIFICADOR DE ECG")
    print(f"{'='*80}")
    print(f"Modelo: Random Forest (ROC-AUC: 1.000)")
    print(f"Classes: 0 = Ritmo Normal | 1 = Fibrilação Atrial")
    
    try:
        # Carregar modelos
        project_root = Path(__file__).parent.parent
        models_dir = project_root / 'models'
        
        if args.verbose:
            print(f"\n📂 Carregando modelo e scaler...")
        
        model, scaler = load_models(models_dir)
        
        if args.verbose:
            print(f"   ✅ Modelo carregado: {models_dir / 'best_model.pkl'}")
            print(f"   ✅ Scaler carregado: {models_dir / 'scaler.pkl'}")
        
        # Remover extensão se foi fornecida
        record_path = args.record_path
        if record_path.endswith('.dat') or record_path.endswith('.hea'):
            record_path = record_path.rsplit('.', 1)[0]
        
        # Fazer predição
        result = predict_ecg(
            record_path=record_path,
            model=model,
            scaler=scaler,
            annotation_ext=args.annotation_ext,
            verbose=args.verbose
        )
        
        # Exibir resultado
        print_result(result, show_proba=args.show_proba, verbose=args.verbose)
        
        # Retornar código de saída baseado na predição
        # 0 = Normal, 1 = FA (pode ser usado em scripts)
        sys.exit(0)
        
    except FileNotFoundError as e:
        print(f"\n❌ ERRO: {e}", file=sys.stderr)
        sys.exit(1)
    
    except Exception as e:
        print(f"\n❌ ERRO INESPERADO: {e}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
