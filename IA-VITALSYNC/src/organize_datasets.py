"""
organize_datasets.py
-------------------
Script auxiliar para organizar os datasets baixados na estrutura correta do projeto.

INSTRUÇÕES DE USO:
==================

1. Após baixar os datasets do PhysioNet, você terá pastas como:
   - aftdb/ (com subpastas: learning-set, test-set-a, test-set-b)
   - nsrdb/ (com arquivos .dat, .hea, .qrs)

2. Mova essas pastas para dentro de 'data/raw/':
   
   IA-VITALSYNC/
   └── data/
       └── raw/
           ├── aftdb/
           │   ├── learning-set/
           │   │   ├── *.dat
           │   │   ├── *.hea
           │   │   └── *.qrs
           │   ├── test-set-a/
           │   │   ├── *.dat
           │   │   ├── *.hea
           │   │   └── *.qrs
           │   └── test-set-b/
           │       ├── *.dat
           │       ├── *.hea
           │       └── *.qrs
           └── nsrdb/
               ├── *.dat
               ├── *.hea
               └── *.qrs

3. Execute este script para verificar se tudo está correto:
   python src/organize_datasets.py
"""

import os
from pathlib import Path
from typing import List


def check_aftdb_structure(aftdb_root: Path) -> bool:
    """
    Verifica se a estrutura do dataset aftdb está correta.
    """
    print("\n" + "=" * 60)
    print("🔍 VERIFICANDO ESTRUTURA DO DATASET AFTDB")
    print("=" * 60)
    
    if not aftdb_root.exists():
        print(f"❌ Pasta '{aftdb_root}' não encontrada!")
        print(f"   Por favor, mova a pasta 'aftdb' para: {aftdb_root.parent}")
        return False
    
    subsets = ['learning-set', 'test-set-a', 'test-set-b']
    all_ok = True
    total_files = 0
    
    for subset in subsets:
        subset_path = aftdb_root / subset
        
        if not subset_path.exists():
            print(f"❌ Subpasta '{subset}' não encontrada em {aftdb_root}")
            all_ok = False
            continue
        
        # Contar arquivos
        dat_files = list(subset_path.glob('*.dat'))
        hea_files = list(subset_path.glob('*.hea'))
        qrs_files = list(subset_path.glob('*.qrs'))
        
        num_records = len(hea_files)
        total_files += num_records
        
        print(f"\n📁 {subset}:")
        print(f"   - {len(dat_files)} arquivos .dat")
        print(f"   - {len(hea_files)} arquivos .hea")
        print(f"   - {len(qrs_files)} arquivos .qrs")
        
        # Verificar consistência
        if len(dat_files) != len(hea_files):
            print(f"   ⚠️  Número de arquivos .dat e .hea não corresponde!")
            all_ok = False
        
        if len(qrs_files) < len(hea_files):
            print(f"   ⚠️  Alguns arquivos .qrs podem estar faltando")
            all_ok = False
        
        # Listar alguns exemplos
        if hea_files:
            print(f"   📄 Exemplos: {', '.join([f.stem for f in hea_files[:5]])}")
    
    print(f"\n{'✅' if all_ok else '❌'} Total de registros encontrados: {total_files}")
    
    return all_ok


def check_nsrdb_structure(nsrdb_root: Path) -> bool:
    """
    Verifica se a estrutura do dataset nsrdb está correta.
    """
    print("\n" + "=" * 60)
    print("🔍 VERIFICANDO ESTRUTURA DO DATASET NSRDB")
    print("=" * 60)
    
    if not nsrdb_root.exists():
        print(f"❌ Pasta '{nsrdb_root}' não encontrada!")
        print(f"   Por favor, mova a pasta 'nsrdb' para: {nsrdb_root.parent}")
        return False
    
    # Contar arquivos (excluindo backups .hea-)
    dat_files = list(nsrdb_root.glob('*.dat'))
    hea_files = [f for f in nsrdb_root.glob('*.hea') if not f.name.endswith('.hea-')]
    atr_files = list(nsrdb_root.glob('*.atr'))  # NSRDB usa .atr
    
    num_records = len(hea_files)
    
    print(f"\n📁 nsrdb (Ritmo Normal):")
    print(f"   - {len(dat_files)} arquivos .dat")
    print(f"   - {len(hea_files)} arquivos .hea (excluindo backups .hea-)")
    print(f"   - {len(atr_files)} arquivos .atr (anotações)")
    
    all_ok = True
    
    # Verificar consistência
    if len(dat_files) != len(hea_files):
        print(f"   ⚠️  Número de arquivos .dat e .hea não corresponde!")
        all_ok = False
    
    if len(atr_files) < len(hea_files):
        print(f"   ⚠️  Alguns arquivos .atr podem estar faltando")
        print(f"      NSRDB usa .atr (em vez de .qrs) para anotações")
        all_ok = False
    
    # Listar alguns exemplos
    if hea_files:
        print(f"   📄 Exemplos: {', '.join([f.stem for f in hea_files[:5]])}")
    
    print(f"\n{'✅' if all_ok else '⚠️'} Total de registros encontrados: {num_records}")
    
    return all_ok


def print_instructions():
    """
    Imprime instruções de como organizar os dados.
    """
    print("\n" + "=" * 60)
    print("📋 INSTRUÇÕES PARA ORGANIZAR OS DATASETS")
    print("=" * 60)
    print("""
1. BAIXAR OS DATASETS:

   a) Dataset AFTDB (Fibrilação Atrial):
      - Acesse: https://physionet.org/content/aftdb/1.0.0/
      - Baixe todos os arquivos ou use: wget -r -N -c -np https://physionet.org/files/aftdb/1.0.0/
   
   b) Dataset NSRDB (Ritmo Normal):
      - Acesse: https://physionet.org/content/nsrdb/1.0.0/
      - Baixe todos os arquivos ou use: wget -r -N -c -np https://physionet.org/files/nsrdb/1.0.0/

2. ORGANIZAR NA ESTRUTURA DO PROJETO:

   Mova as pastas baixadas para:
   
   IA-VITALSYNC/data/raw/
   ├── aftdb/
   │   ├── learning-set/
   │   ├── test-set-a/
   │   └── test-set-b/
   └── nsrdb/
       ├── 16265.dat
       ├── 16265.hea
       ├── 16265.atr  ← Anotações (não .qrs!)
       ├── 16265.hea- (backup, pode ignorar)
       └── 16265.xws  (visualização, pode ignorar)

3. VERIFICAR:
   
   Execute novamente este script para verificar se está tudo OK:
   
   python src/organize_datasets.py

4. PRÓXIMOS PASSOS:
   
   Após organizar os dados, você pode:
   - Executar: python src/data_loader.py (para listar os registros)
   - Executar: python src/feature_extraction.py (para extrair features)
""")


if __name__ == "__main__":
    # Definir caminhos
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_raw = project_root / 'data' / 'raw'
    
    aftdb_root = data_raw / 'aftdb'
    nsrdb_root = data_raw / 'nsrdb'
    
    print("=" * 60)
    print("🏥 IA-VITALSYNC - VERIFICADOR DE ESTRUTURA DE DADOS")
    print("=" * 60)
    print(f"\n📂 Diretório do projeto: {project_root}")
    print(f"📂 Diretório de dados: {data_raw}")
    
    # Verificar estruturas
    aftdb_ok = check_aftdb_structure(aftdb_root)
    nsrdb_ok = check_nsrdb_structure(nsrdb_root)
    
    # Resultado final
    print("\n" + "=" * 60)
    if aftdb_ok and nsrdb_ok:
        print("✅ TUDO CERTO! Os datasets estão organizados corretamente.")
        print("=" * 60)
        print("\n🚀 Próximo passo:")
        print("   Execute: python src/feature_extraction.py")
    else:
        print("❌ AÇÃO NECESSÁRIA! Organize os datasets conforme as instruções.")
        print("=" * 60)
        print_instructions()
