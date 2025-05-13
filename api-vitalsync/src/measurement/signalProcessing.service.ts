/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignalProcessingService {
  analyzePPG(
    ir: number[],
    red: number[],
    sampleRate: number,
  ): {
    heartRate: number;
    hrv: number;
    spo2: number;
    perfusionIndex: number;
  } {
    const filtered = this.applyFilters(ir, red);

    return {
      heartRate: this.calculateHeartRate(filtered.ir, sampleRate),
      hrv: this.calculateHRV(filtered.ir),
      spo2: this.calculateSpO2(filtered.ir, filtered.red),
      perfusionIndex: this.calculatePerfusionIndex(filtered.red),
    };
  }

  private applyFilters(ir: number[], red: number[]) {
    // Placeholder de filtro - apenas remove ruídos extremos
    const filter = (arr: number[]) =>
      arr.map((val) => Math.max(0, Math.min(1024, val)));
    return { ir: filter(ir), red: filter(red) };
  }

  calculateHeartRate(signal: number[], sampleRate: number): number {
    const peaks = this.detectPeaks(signal);
    return peaks.length > 1
      ? (60 * sampleRate) / this.averageInterval(peaks)
      : 0;
  }

  calculateHRV(signal: number[]): number {
    const rrIntervals = this.getRRIntervals(signal);
    return this.rMSSD(rrIntervals);
  }

  calculateSpO2(ir: number[], red: number[]): number {
    const ratio = this.calculateRatio(red, ir);
    return Math.min(Math.max(110 - 25 * ratio, 70), 100);
  }

  calculatePerfusionIndex(red: number[]): number {
    const ac = this.ACComponent(red);
    const dc = this.DCComponent(red);
    return dc > 0 ? (ac / dc) * 100 : 0;
  }

  calculateIrregularity(signal: number[]): number {
    const intervals = this.getRRIntervals(signal);
    return this.calculateIrregularityIndex(intervals);
  }

  private calculateIrregularityIndex(rrIntervals: number[]): number {
    if (rrIntervals.length < 2) return 0;
    const mean = rrIntervals.reduce((a, b) => a + b) / rrIntervals.length;
    const variance =
      rrIntervals.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
      rrIntervals.length;
    return Math.sqrt(variance) / mean;
  }

  private detectPeaks(signal: number[]): number[] {
    const threshold = this.mean(signal) * 1.2;
    const peaks: number[] = [];
    for (let i = 1; i < signal.length - 1; i++) {
      if (
        signal[i] > threshold &&
        signal[i] > signal[i - 1] &&
        signal[i] > signal[i + 1]
      ) {
        peaks.push(i);
      }
    }
    return peaks;
  }

  private getRRIntervals(signal: number[]): number[] {
    const sampleRate = 100; // Hz - exemplo
    const peaks = this.detectPeaks(signal);
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      const deltaSamples = peaks[i] - peaks[i - 1];
      const intervalMs = (deltaSamples / sampleRate) * 1000;
      intervals.push(intervalMs);
    }
    return intervals;
  }

  private rMSSD(rrIntervals: number[]): number {
    if (rrIntervals.length < 2) return 0;
    const diffs = rrIntervals.slice(1).map((val, i) => val - rrIntervals[i]);
    const squaredDiffs = diffs.map((d) => d * d);
    const meanSquared =
      squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    return Math.sqrt(meanSquared);
  }

  private calculateRatio(red: number[], ir: number[]): number {
    const redAc = this.ACComponent(red);
    const redDc = this.DCComponent(red);
    const irAc = this.ACComponent(ir);
    const irDc = this.DCComponent(ir);

    const ratio = redAc / redDc / (irAc / irDc);
    return isFinite(ratio) ? ratio : 0.5;
  }

  private ACComponent(signal: number[]): number {
    const mean = this.mean(signal);
    return Math.sqrt(
      signal.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
        signal.length,
    );
  }

  private DCComponent(signal: number[]): number {
    return this.mean(signal);
  }

  private averageInterval(peaks: number[]): number {
    if (peaks.length < 2) return 0;
    const intervals = peaks.slice(1).map((val, i) => val - peaks[i]);
    const meanInterval =
      intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return meanInterval;
  }

  private mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}
