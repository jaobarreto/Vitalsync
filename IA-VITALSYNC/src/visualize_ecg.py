"""
visualize_ecg.py
---------------
Script para visualizar exemplos de ECG de Fibrilação Atrial.

Mostra:
1. O sinal de ECG bruto
2. Os picos R detectados
3. Os intervalos R-R e sua variabilidade
"""

import numpy as np
import matplotlib.pyplot as plt
import wfdb
from pathlib import Path
import sys


def plot_ecg_with_r_peaks(record_path: str, duration: int = 10, title: str = "ECG"):
    """
    Plota um ECG com os picos R marcados.
    
    Args:
        record_path: Caminho completo para o registro (sem extensão)
        duration: Duração em segundos para plotar (padrão: 10 segundos)
        title: Título do gráfico
    """
    try:
        # 1. Ler o registro (sinal + metadados)
        record = wfdb.rdrecord(record_path)
        
        # 2. Ler as anotações dos picos R
        annotation = wfdb.rdann(record_path, 'qrs')
        
        # 3. Extrair informações
        signal = record.p_signal[:, 0]  # Primeiro canal do ECG
        fs = record.fs  # Frequência de amostragem
        r_peaks = annotation.sample  # Posições dos picos R
        
        # 4. Limitar ao período de visualização
        num_samples = int(duration * fs)
        if num_samples > len(signal):
            num_samples = len(signal)
        
        signal_segment = signal[:num_samples]
        time = np.arange(len(signal_segment)) / fs
        
        # Filtrar picos R que estão no segmento
        r_peaks_segment = r_peaks[r_peaks < num_samples]
        
        # 5. Calcular intervalos R-R
        rr_intervals_samples = np.diff(r_peaks_segment)
        rr_intervals_sec = rr_intervals_samples / fs
        
        # Estatísticas
        mean_rr = np.mean(rr_intervals_sec) if len(rr_intervals_sec) > 0 else 0
        std_rr = np.std(rr_intervals_sec) if len(rr_intervals_sec) > 0 else 0
        cv_rr = (std_rr / mean_rr * 100) if mean_rr > 0 else 0
        mean_hr = 60.0 / mean_rr if mean_rr > 0 else 0
        
        # 6. Criar figura com 2 subplots
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
        
        # --- SUBPLOT 1: Sinal de ECG com picos R ---
        ax1.plot(time, signal_segment, 'b-', linewidth=0.8, label='ECG')
        
        # Marcar os picos R
        r_peaks_time = r_peaks_segment / fs
        r_peaks_values = signal_segment[r_peaks_segment]
        ax1.plot(r_peaks_time, r_peaks_values, 'ro', markersize=8, label='Picos R')
        
        ax1.set_xlabel('Tempo (segundos)', fontsize=12)
        ax1.set_ylabel('Amplitude (mV)', fontsize=12)
        ax1.set_title(f'{title}\n{Path(record_path).name} | FS={fs} Hz | FC média={mean_hr:.1f} bpm', 
                     fontsize=14, fontweight='bold')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')
        
        # Adicionar texto com estatísticas
        stats_text = f'Batimentos: {len(r_peaks_segment)}\nMédia R-R: {mean_rr:.3f}s\nDesvio Padrão: {std_rr:.3f}s\nCV: {cv_rr:.1f}%'
        ax1.text(0.02, 0.98, stats_text, transform=ax1.transAxes, 
                fontsize=10, verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        # --- SUBPLOT 2: Intervalos R-R (Tacograma) ---
        if len(rr_intervals_sec) > 0:
            rr_time = r_peaks_time[1:]  # Tempo do segundo pico de cada intervalo
            ax2.plot(rr_time, rr_intervals_sec, 'g-o', linewidth=2, markersize=6)
            ax2.axhline(y=mean_rr, color='r', linestyle='--', linewidth=2, label=f'Média: {mean_rr:.3f}s')
            ax2.fill_between(rr_time, mean_rr - std_rr, mean_rr + std_rr, 
                            color='red', alpha=0.2, label=f'±1 DP: {std_rr:.3f}s')
            
            ax2.set_xlabel('Tempo (segundos)', fontsize=12)
            ax2.set_ylabel('Intervalo R-R (segundos)', fontsize=12)
            ax2.set_title('Variabilidade dos Intervalos R-R (Tacograma)', fontsize=12, fontweight='bold')
            ax2.grid(True, alpha=0.3)
            ax2.legend(loc='upper right')
            
            # Destacar irregularidade
            variability_text = "⚠️ ALTA VARIABILIDADE\n(típico de Fibrilação Atrial)" if cv_rr > 10 else "Variabilidade baixa"
            color = 'red' if cv_rr > 10 else 'green'
            ax2.text(0.98, 0.98, variability_text, transform=ax2.transAxes, 
                    fontsize=11, verticalalignment='top', horizontalalignment='right',
                    bbox=dict(boxstyle='round', facecolor=color, alpha=0.3),
                    fontweight='bold')
        
        plt.tight_layout()
        return fig, (mean_rr, std_rr, cv_rr, mean_hr)
        
    except Exception as e:
        print(f"❌ Erro ao plotar {Path(record_path).name}: {e}")
        return None, None


def visualize_multiple_examples(aftdb_root: str, num_examples: int = 3):
    """
    Visualiza múltiplos exemplos de ECG de FA de diferentes subsets.
    
    Args:
        aftdb_root: Caminho para a pasta raiz do AFTDB
        num_examples: Número de exemplos a mostrar de cada subset
    """
    aftdb_path = Path(aftdb_root)
    
    # Definir exemplos de cada subset
    examples = {
        'learning-set': ['a01', 'n01', 's01'],
        'test-set-a': ['a10', 'a15', 'a20'],
        'test-set-b': ['b01', 'b05', 'b10']
    }
    
    print("=" * 80)
    print("📊 VISUALIZANDO EXEMPLOS DE ECG - FIBRILAÇÃO ATRIAL")
    print("=" * 80)
    
    all_stats = []
    
    for subset, records in examples.items():
        print(f"\n📁 Subset: {subset}")
        print("-" * 80)
        
        subset_path = aftdb_path / subset
        
        if not subset_path.exists():
            print(f"⚠️  Pasta '{subset}' não encontrada. Pulando...")
            continue
        
        for i, record_name in enumerate(records[:num_examples]):
            record_path = subset_path / record_name
            
            if not record_path.with_suffix('.hea').exists():
                print(f"⚠️  Registro '{record_name}' não encontrado. Pulando...")
                continue
            
            print(f"\n{i+1}. Analisando: {record_name}")
            
            # Plotar
            title = f"Fibrilação Atrial - {subset}"
            fig, stats = plot_ecg_with_r_peaks(str(record_path), duration=10, title=title)
            
            if stats:
                mean_rr, std_rr, cv_rr, mean_hr = stats
                print(f"   ✅ Frequência Cardíaca: {mean_hr:.1f} bpm")
                print(f"   ✅ Intervalo R-R médio: {mean_rr:.3f}s (±{std_rr:.3f}s)")
                print(f"   ✅ Coeficiente de Variação: {cv_rr:.1f}%")
                
                all_stats.append({
                    'record': record_name,
                    'subset': subset,
                    'mean_rr': mean_rr,
                    'std_rr': std_rr,
                    'cv_rr': cv_rr,
                    'mean_hr': mean_hr
                })
            
            # Salvar figura
            output_dir = Path(__file__).parent.parent / 'reports' / 'figures'
            output_dir.mkdir(parents=True, exist_ok=True)
            output_file = output_dir / f'ecg_example_{subset}_{record_name}.png'
            
            if fig:
                fig.savefig(output_file, dpi=150, bbox_inches='tight')
                print(f"   💾 Salvo em: {output_file}")
                plt.close(fig)
    
    # Resumo estatístico
    if all_stats:
        print("\n" + "=" * 80)
        print("📈 RESUMO ESTATÍSTICO DOS EXEMPLOS DE FA")
        print("=" * 80)
        print(f"\n{'Registro':<15} {'Subset':<15} {'FC (bpm)':<12} {'R-R médio':<12} {'DP R-R':<12} {'CV (%)':<10}")
        print("-" * 80)
        
        for stat in all_stats:
            print(f"{stat['record']:<15} {stat['subset']:<15} {stat['mean_hr']:>10.1f}  "
                  f"{stat['mean_rr']:>10.3f}s  {stat['std_rr']:>10.3f}s  {stat['cv_rr']:>8.1f}%")
        
        # Médias gerais
        avg_cv = np.mean([s['cv_rr'] for s in all_stats])
        avg_std = np.mean([s['std_rr'] for s in all_stats])
        avg_hr = np.mean([s['mean_hr'] for s in all_stats])
        
        print("-" * 80)
        print(f"{'MÉDIA GERAL':<15} {'':<15} {avg_hr:>10.1f}  {'':<12}  {avg_std:>10.3f}s  {avg_cv:>8.1f}%")
        print("=" * 80)
        
        print("\n💡 INTERPRETAÇÃO:")
        print(f"   • CV médio de {avg_cv:.1f}% indica {'ALTA' if avg_cv > 10 else 'MODERADA'} irregularidade")
        print("   • Isto é característico da Fibrilação Atrial!")
        print("   • Compare com Ritmo Normal que tipicamente tem CV < 5%")
    
    print("\n✅ Visualizações concluídas!")
    print(f"📁 Gráficos salvos em: {output_dir}")


if __name__ == "__main__":
    # Determinar caminho do AFTDB
    if len(sys.argv) > 1:
        aftdb_root = sys.argv[1]
    else:
        script_dir = Path(__file__).parent
        aftdb_root = script_dir.parent / 'data' / 'raw' / 'aftdb'
    
    # Visualizar exemplos
    visualize_multiple_examples(str(aftdb_root), num_examples=3)
    
    print("\n" + "=" * 80)
    print("🎯 PRÓXIMO PASSO:")
    print("   Execute: python src/feature_extraction.py")
    print("   (para extrair features de TODOS os 80 registros)")
    print("=" * 80)
