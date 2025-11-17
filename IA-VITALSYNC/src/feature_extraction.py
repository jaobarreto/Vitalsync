"""
feature_extraction.py
--------------------
Script para extrair características (features) de sinais de ECG.

Features principais:
- Intervalos R-R (tempo entre batimentos consecutivos)
- Estatísticas de variabilidade (desvio padrão, média, mediana, RMSSD, etc.)
"""

import numpy as np
import pandas as pd
import wfdb
from typing import Dict, List, Optional
from pathlib import Path


def extract_rr_intervals(annotation_samples: np.ndarray, sampling_freq: float) -> np.ndarray:
    """
    Calcula os intervalos R-R em segundos a partir das anotações de picos R.
    
    Args:
        annotation_samples: Array com as posições (em amostras) dos picos R
        sampling_freq: Frequência de amostragem do sinal (geralmente 128 Hz ou 250 Hz)
        
    Returns:
        Array com os intervalos R-R em segundos
    """
    # Calcular diferença entre picos consecutivos (em amostras)
    rr_intervals_samples = np.diff(annotation_samples)
    
    # Converter para segundos
    rr_intervals_sec = rr_intervals_samples / sampling_freq
    
    return rr_intervals_sec


def calculate_rmssd(rr_intervals: np.ndarray) -> float:
    """
    Calcula o RMSSD (Root Mean Square of Successive Differences).
    
    RMSSD é uma medida importante de variabilidade da frequência cardíaca.
    Valores ALTOS indicam maior irregularidade (típico de FA).
    
    Args:
        rr_intervals: Array com intervalos R-R em segundos
        
    Returns:
        Valor do RMSSD
    """
    if len(rr_intervals) < 2:
        return 0.0
    
    # Diferenças sucessivas
    successive_diffs = np.diff(rr_intervals)
    
    # Quadrado das diferenças
    squared_diffs = successive_diffs ** 2
    
    # Raiz quadrada da média
    rmssd = np.sqrt(np.mean(squared_diffs))
    
    return rmssd


def calculate_cv(rr_intervals: np.ndarray) -> float:
    """
    Calcula o Coeficiente de Variação (CV) dos intervalos R-R.
    
    CV = (desvio padrão / média) * 100
    
    Esta é uma medida normalizada de variabilidade. Na FA, o CV é tipicamente ALTO.
    
    Args:
        rr_intervals: Array com intervalos R-R em segundos
        
    Returns:
        Coeficiente de variação (%)
    """
    if len(rr_intervals) == 0:
        return 0.0
    
    mean_rr = np.mean(rr_intervals)
    std_rr = np.std(rr_intervals)
    
    if mean_rr == 0:
        return 0.0
    
    cv = (std_rr / mean_rr) * 100
    
    return cv


def extract_features_from_record(record_path: str, label: int, annotation_ext: str = 'qrs') -> Optional[Dict]:
    """
    Extrai todas as features de um registro de ECG.
    
    Args:
        record_path: Caminho completo para o registro (sem extensão)
                    Ex: '/path/to/aftdb/test-set-a/a01'
        label: Rótulo do registro (1 para FA, 0 para Normal)
        annotation_ext: Extensão do arquivo de anotações ('qrs' para AFTDB, 'atr' para NSRDB)
        
    Returns:
        Dicionário com todas as features extraídas, ou None se houver erro
    """
    try:
        # 1. Ler o registro (sinal + metadados)
        record = wfdb.rdrecord(record_path)
        
        # 2. Ler as anotações dos picos R
        # IMPORTANTE: Usa 'qrs' para AFTDB e 'atr' para NSRDB
        annotation = wfdb.rdann(record_path, annotation_ext)
        
        # 3. Obter frequência de amostragem
        fs = record.fs
        
        # 4. Obter posições dos picos R
        r_peaks = annotation.sample
        
        # Verificar se há picos suficientes
        if len(r_peaks) < 2:
            print(f"⚠️  Registro {Path(record_path).name}: Apenas {len(r_peaks)} pico(s) R encontrado(s). Pulando...")
            return None
        
        # 5. Calcular intervalos R-R em segundos
        rr_intervals = extract_rr_intervals(r_peaks, fs)
        
        if len(rr_intervals) == 0:
            print(f"⚠️  Registro {Path(record_path).name}: Nenhum intervalo R-R calculado. Pulando...")
            return None
        
        # 6. Extrair features estatísticas
        features = {
            # Identificação
            'record_name': Path(record_path).name,
            'label': label,
            
            # Informações básicas
            'num_beats': len(r_peaks),
            'num_rr_intervals': len(rr_intervals),
            'sampling_freq': fs,
            
            # Features de intervalo R-R (em segundos)
            'rr_mean': np.mean(rr_intervals),
            'rr_std': np.std(rr_intervals),
            'rr_median': np.median(rr_intervals),
            'rr_min': np.min(rr_intervals),
            'rr_max': np.max(rr_intervals),
            
            # Features de variabilidade (PRINCIPAIS para detectar FA)
            'rr_cv': calculate_cv(rr_intervals),  # Coeficiente de Variação
            'rr_rmssd': calculate_rmssd(rr_intervals),  # RMSSD
            
            # Features adicionais
            'rr_range': np.max(rr_intervals) - np.min(rr_intervals),
            'rr_percentile_25': np.percentile(rr_intervals, 25),
            'rr_percentile_75': np.percentile(rr_intervals, 75),
            'rr_iqr': np.percentile(rr_intervals, 75) - np.percentile(rr_intervals, 25),
            
            # Frequência cardíaca média (batimentos por minuto)
            'mean_hr_bpm': 60.0 / np.mean(rr_intervals) if np.mean(rr_intervals) > 0 else 0,
        }
        
        return features
        
    except FileNotFoundError as e:
        print(f"❌ Erro ao ler registro {Path(record_path).name}: Arquivo não encontrado - {e}")
        return None
    except Exception as e:
        print(f"❌ Erro ao processar registro {Path(record_path).name}: {e}")
        return None


def extract_features_from_all_records(records_info: List[Dict]) -> pd.DataFrame:
    """
    Extrai features de todos os registros e retorna um DataFrame.
    
    Args:
        records_info: Lista de dicionários com informações dos registros
                     (retornado por data_loader.load_all_records())
        
    Returns:
        DataFrame do Pandas com todas as features extraídas
    """
    all_features = []
    
    print("=" * 60)
    print("⚙️  EXTRAINDO FEATURES DE TODOS OS REGISTROS")
    print("=" * 60)
    
    for i, record_info in enumerate(records_info, 1):
        record_path = record_info['full_path']
        label = record_info['label']
        dataset = record_info['dataset']
        annotation_ext = record_info.get('annotation_ext', 'qrs')  # Default para 'qrs'
        
        # Feedback de progresso
        if i % 10 == 0 or i == 1:
            print(f"Processando registro {i}/{len(records_info)}: {record_info['record_name']} ({dataset})")
        
        # Extrair features
        features = extract_features_from_record(record_path, label, annotation_ext)
        
        if features is not None:
            # Adicionar informações extras do dataset
            features['dataset'] = dataset
            features['subset'] = record_info.get('subset', 'main')
            all_features.append(features)
    
    # Criar DataFrame
    df = pd.DataFrame(all_features)
    
    print("=" * 60)
    print(f"✅ EXTRAÇÃO CONCLUÍDA")
    print(f"   Total de registros processados: {len(df)}")
    print(f"   - Fibrilação Atrial (label=1): {len(df[df['label'] == 1])}")
    print(f"   - Ritmo Normal (label=0): {len(df[df['label'] == 0])}")
    print(f"   Features extraídas: {len(df.columns)} colunas")
    print("=" * 60)
    
    return df


if __name__ == "__main__":
    # Teste do script
    from data_loader import load_all_records
    from pathlib import Path
    import sys
    
    # Caminho padrão
    if len(sys.argv) > 1:
        data_root = sys.argv[1]
    else:
        script_dir = Path(__file__).parent
        data_root = script_dir.parent / 'data' / 'raw'
    
    # Carregar registros
    records = load_all_records(str(data_root))
    
    # Extrair features
    df_features = extract_features_from_all_records(records)
    
    # Salvar em CSV
    output_path = Path(__file__).parent.parent / 'data' / 'processed' / 'features.csv'
    df_features.to_csv(output_path, index=False)
    print(f"\n💾 Features salvas em: {output_path}")
    
    # Mostrar primeiras linhas
    print("\n📊 Primeiras linhas do dataset:")
    print(df_features.head())
    
    # Estatísticas descritivas
    print("\n📈 Estatísticas descritivas das principais features:")
    print(df_features[['rr_mean', 'rr_std', 'rr_cv', 'rr_rmssd', 'label']].describe())
