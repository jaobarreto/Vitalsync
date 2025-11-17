"""
download_datasets.py
-------------------
Script para baixar automaticamente os datasets do PhysioNet.

IMPORTANTE: Certifique-se de ter uma conexão com a internet estável.
Os datasets podem ter alguns MB de tamanho.
"""

import urllib.request
import os
from pathlib import Path
from typing import List
import shutil


def download_file(url: str, destination: Path):
    """
    Baixa um arquivo da internet.
    
    Args:
        url: URL do arquivo
        destination: Caminho local onde salvar
    """
    print(f"   Baixando: {destination.name}...", end=" ")
    try:
        urllib.request.urlretrieve(url, destination)
        print("✅")
        return True
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False


def download_aftdb_records(base_url: str, subset: str, record_names: List[str], dest_folder: Path):
    """
    Baixa registros de um subset do AFTDB.
    
    Args:
        base_url: URL base do PhysioNet
        subset: Nome do subset (learning-set, test-set-a, test-set-b)
        record_names: Lista de nomes de registros (ex: ['a01', 'a02', ...])
        dest_folder: Pasta de destino
    """
    dest_folder.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📁 Baixando subset: {subset}")
    print(f"   Destino: {dest_folder}")
    
    extensions = ['.dat', '.hea', '.qrs']
    
    for record in record_names:
        for ext in extensions:
            file_url = f"{base_url}/{subset}/{record}{ext}"
            dest_file = dest_folder / f"{record}{ext}"
            
            # Pular se já existe
            if dest_file.exists():
                print(f"   ⏭️  {record}{ext} já existe, pulando...")
                continue
            
            download_file(file_url, dest_file)


def download_aftdb_dataset(dest_root: Path):
    """
    Baixa o dataset completo AFTDB.
    
    O dataset AFTDB tem a seguinte estrutura:
    - learning-set: Registros para treinamento (a01-a25, n01-n25)
    - test-set-a: Conjunto de teste A (a01-a25)
    - test-set-b: Conjunto de teste B (b01-b10)
    """
    base_url = "https://physionet.org/files/aftdb/1.0.0"
    
    print("=" * 60)
    print("📥 BAIXANDO DATASET AFTDB (Fibrilação Atrial)")
    print("=" * 60)
    
    # Definir registros de cada subset
    # NOTA: Estes são exemplos. Você pode precisar ajustar conforme a documentação do PhysioNet
    
    # Learning set: a01-a25, n01-n25
    learning_records = [f"a{i:02d}" for i in range(1, 26)] + [f"n{i:02d}" for i in range(1, 26)]
    
    # Test set A: a01-a25
    test_a_records = [f"a{i:02d}" for i in range(1, 26)]
    
    # Test set B: b01-b10 (exemplo, verifique a documentação)
    test_b_records = [f"b{i:02d}" for i in range(1, 11)]
    
    # Baixar cada subset
    download_aftdb_records(base_url, "learning-set", learning_records, dest_root / "learning-set")
    download_aftdb_records(base_url, "test-set-a", test_a_records, dest_root / "test-set-a")
    download_aftdb_records(base_url, "test-set-b", test_b_records, dest_root / "test-set-b")
    
    print("\n✅ Download do AFTDB concluído!")


def download_nsrdb_dataset(dest_root: Path):
    """
    Baixa o dataset completo NSRDB.
    
    O dataset NSRDB contém registros de ritmo sinusal normal.
    """
    base_url = "https://physionet.org/files/nsrdb/1.0.0"
    
    print("\n" + "=" * 60)
    print("📥 BAIXANDO DATASET NSRDB (Ritmo Normal)")
    print("=" * 60)
    
    dest_root.mkdir(parents=True, exist_ok=True)
    
    # Registros do NSRDB (16001-16773, 19088-19093, 19140, 19830)
    # Vamos baixar os principais
    record_ranges = [
        (16001, 16024),  # Primeiros 24 registros
        (19088, 19094),  # Registros especiais
    ]
    
    record_names = []
    for start, end in record_ranges:
        record_names.extend([str(i) for i in range(start, end)])
    
    extensions = ['.dat', '.hea', '.qrs']
    
    for record in record_names:
        for ext in extensions:
            file_url = f"{base_url}/{record}{ext}"
            dest_file = dest_root / f"{record}{ext}"
            
            if dest_file.exists():
                print(f"   ⏭️  {record}{ext} já existe, pulando...")
                continue
            
            download_file(file_url, dest_file)
    
    print("\n✅ Download do NSRDB concluído!")


def main():
    """
    Função principal.
    """
    # Determinar caminhos
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_raw = project_root / 'data' / 'raw'
    
    print("=" * 60)
    print("🏥 IA-VITALSYNC - DOWNLOAD AUTOMÁTICO DE DATASETS")
    print("=" * 60)
    print(f"\n📂 Diretório do projeto: {project_root}")
    print(f"📂 Diretório de destino: {data_raw}")
    
    # Perguntar ao usuário o que baixar
    print("\n" + "=" * 60)
    print("O que você deseja baixar?")
    print("1 - Dataset AFTDB (Fibrilação Atrial)")
    print("2 - Dataset NSRDB (Ritmo Normal)")
    print("3 - Ambos os datasets")
    print("=" * 60)
    
    choice = input("Digite sua escolha (1/2/3): ").strip()
    
    if choice in ['1', '3']:
        aftdb_dest = data_raw / 'aftdb'
        download_aftdb_dataset(aftdb_dest)
    
    if choice in ['2', '3']:
        nsrdb_dest = data_raw / 'nsrdb'
        download_nsrdb_dataset(nsrdb_dest)
    
    print("\n" + "=" * 60)
    print("✅ DOWNLOAD CONCLUÍDO!")
    print("=" * 60)
    print("\n🚀 Próximos passos:")
    print("   1. Execute: python src/organize_datasets.py (para verificar)")
    print("   2. Execute: python src/feature_extraction.py (para extrair features)")


if __name__ == "__main__":
    print("\n⚠️  AVISO: Este script pode não funcionar perfeitamente!")
    print("   Razão: Os nomes exatos dos registros podem variar.")
    print("   Recomendação: Baixe manualmente do PhysioNet:")
    print("   - https://physionet.org/content/aftdb/1.0.0/")
    print("   - https://physionet.org/content/nsrdb/1.0.0/")
    print("\n   Ou use wget:")
    print("   wget -r -N -c -np https://physionet.org/files/aftdb/1.0.0/")
    print("   wget -r -N -c -np https://physionet.org/files/nsrdb/1.0.0/")
    print("\n" + "=" * 60)
    
    proceed = input("\nDeseja continuar mesmo assim? (s/n): ").strip().lower()
    if proceed == 's':
        main()
    else:
        print("\n👋 Download cancelado. Use wget ou baixe manualmente!")
