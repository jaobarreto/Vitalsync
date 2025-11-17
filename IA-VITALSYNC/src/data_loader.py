"""
data_loader.py
--------------
Script para localizar e listar todos os registros de ECG dos datasets aftdb e nsrdb.

Para aftdb: Processa TODAS as três pastas (learning-set, test-set-a, test-set-b)
            como exemplos de Fibrilação Atrial (label=1).
"""

import os
from pathlib import Path
from typing import List, Dict
import wfdb


def find_aftdb_records(aftdb_root: str) -> List[Dict[str, str]]:
    """
    Encontra TODOS os registros de ECG nas três pastas do dataset aftdb.
    
    Estrutura esperada:
    aftdb_root/
    ├── learning-set/
    ├── test-set-a/
    └── test-set-b/
    
    Args:
        aftdb_root: Caminho para a pasta raiz do dataset aftdb
        
    Returns:
        Lista de dicionários com informações de cada registro:
        [
            {
                'record_name': 'a01',
                'full_path': '/path/to/test-set-a/a01',
                'subset': 'test-set-a',
                'label': 1
            },
            ...
        ]
    """
    aftdb_path = Path(aftdb_root)
    
    # As três pastas que contêm dados de FA
    subsets = ['learning-set', 'test-set-a', 'test-set-b']
    
    all_records = []
    
    for subset in subsets:
        subset_path = aftdb_path / subset
        
        if not subset_path.exists():
            print(f"⚠️  Aviso: Pasta '{subset}' não encontrada em {aftdb_root}")
            continue
        
        # Encontrar todos os arquivos .hea (header) nesta pasta
        hea_files = list(subset_path.glob('*.hea'))
        
        for hea_file in hea_files:
            record_name = hea_file.stem  # Nome do arquivo sem extensão
            full_path = str(subset_path / record_name)
            
            all_records.append({
                'record_name': record_name,
                'full_path': full_path,
                'subset': subset,
                'label': 1,  # Todos são Fibrilação Atrial
                'dataset': 'aftdb',
                'annotation_ext': 'qrs'  # AFTDB usa .qrs
            })
    
    print(f"✅ Dataset aftdb: {len(all_records)} registros encontrados")
    print(f"   - learning-set: {sum(1 for r in all_records if r['subset'] == 'learning-set')}")
    print(f"   - test-set-a: {sum(1 for r in all_records if r['subset'] == 'test-set-a')}")
    print(f"   - test-set-b: {sum(1 for r in all_records if r['subset'] == 'test-set-b')}")
    
    return all_records


def find_nsrdb_records(nsrdb_root: str) -> List[Dict[str, str]]:
    """
    Encontra todos os registros de ECG do dataset nsrdb (Ritmo Normal).
    
    IMPORTANTE: NSRDB usa arquivos .atr (em vez de .qrs) para anotações.
    
    Estrutura esperada:
    nsrdb_root/
    ├── 16265.dat
    ├── 16265.hea
    ├── 16265.atr  ← Anotações dos picos R
    ├── 16265.hea- (backup, ignorar)
    └── 16265.xws  (visualização, ignorar)
    
    Args:
        nsrdb_root: Caminho para a pasta raiz do dataset nsrdb
        
    Returns:
        Lista de dicionários com informações de cada registro:
        [
            {
                'record_name': '16265',
                'full_path': '/path/to/nsrdb/16265',
                'subset': 'main',
                'label': 0,
                'annotation_ext': 'atr'
            },
            ...
        ]
    """
    nsrdb_path = Path(nsrdb_root)
    
    if not nsrdb_path.exists():
        print(f"⚠️  Aviso: Pasta '{nsrdb_root}' não encontrada")
        return []
    
    all_records = []
    
    # Encontrar todos os arquivos .hea (header), excluindo backups (.hea-)
    hea_files = [f for f in nsrdb_path.glob('*.hea') if not f.name.endswith('.hea-')]
    
    for hea_file in hea_files:
        record_name = hea_file.stem
        full_path = str(nsrdb_path / record_name)
        
        all_records.append({
            'record_name': record_name,
            'full_path': full_path,
            'subset': 'main',
            'label': 0,  # Ritmo Normal
            'dataset': 'nsrdb',
            'annotation_ext': 'atr'  # NSRDB usa .atr em vez de .qrs
        })
    
    print(f"✅ Dataset nsrdb: {len(all_records)} registros encontrados")
    
    return all_records


def load_all_records(data_root: str) -> List[Dict[str, str]]:
    """
    Carrega informações de TODOS os registros (aftdb + nsrdb).
    
    Args:
        data_root: Caminho para a pasta 'data/raw' que contém as subpastas aftdb e nsrdb
        
    Returns:
        Lista consolidada de todos os registros
    """
    data_path = Path(data_root)
    
    aftdb_root = data_path / 'aftdb'
    nsrdb_root = data_path / 'nsrdb'
    
    print("=" * 60)
    print("🔍 CARREGANDO REGISTROS DE ECG")
    print("=" * 60)
    
    # Carregar registros de FA (todas as 3 pastas)
    aftdb_records = find_aftdb_records(str(aftdb_root))
    
    # Carregar registros normais
    nsrdb_records = find_nsrdb_records(str(nsrdb_root))
    
    # Consolidar
    all_records = aftdb_records + nsrdb_records
    
    print("=" * 60)
    print(f"📊 RESUMO TOTAL:")
    print(f"   Total de registros: {len(all_records)}")
    print(f"   - Fibrilação Atrial (label=1): {sum(1 for r in all_records if r['label'] == 1)}")
    print(f"   - Ritmo Normal (label=0): {sum(1 for r in all_records if r['label'] == 0)}")
    print("=" * 60)
    
    return all_records


def verify_record_files(record_info: Dict[str, str]) -> Dict[str, bool]:
    """
    Verifica se todos os arquivos necessários (.dat, .hea, .qrs/.atr) existem para um registro.
    
    Args:
        record_info: Dicionário com informações do registro (deve conter 'full_path' e 'annotation_ext')
        
    Returns:
        Dicionário com status de cada arquivo:
        {
            'dat': True/False,
            'hea': True/False,
            'annotation': True/False  # .qrs para AFTDB, .atr para NSRDB
        }
    """
    base_path = record_info['full_path']
    annotation_ext = record_info.get('annotation_ext', 'qrs')  # Default para qrs (compatibilidade)
    
    return {
        'dat': os.path.exists(f"{base_path}.dat"),
        'hea': os.path.exists(f"{base_path}.hea"),
        'annotation': os.path.exists(f"{base_path}.{annotation_ext}")
    }


if __name__ == "__main__":
    # Teste do script
    import sys
    
    # Caminho padrão (ajuste conforme necessário)
    if len(sys.argv) > 1:
        data_root = sys.argv[1]
    else:
        # Assumir estrutura padrão do projeto
        script_dir = Path(__file__).parent
        data_root = script_dir.parent / 'data' / 'raw'
    
    records = load_all_records(str(data_root))
    
    # Verificar integridade de alguns registros
    print("\n🔍 Verificando integridade dos primeiros 5 registros:")
    for record in records[:5]:
        files = verify_record_files(record)
        status = "✅" if all(files.values()) else "❌"
        ann_ext = record.get('annotation_ext', 'qrs')
        print(f"{status} {record['record_name']} ({record['dataset']}): "
              f".dat={files['dat']}, .hea={files['hea']}, .{ann_ext}={files['annotation']}")
