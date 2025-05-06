/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeasurementDto } from './dto/measurement.dto';
import { SignalProcessingService } from './signalProcessing.service';

@Injectable()
export class MeasurementService {
  constructor(
    private prisma: PrismaService,
    private signalProcessor: SignalProcessingService,
  ) {}

  async processRawData(dto: MeasurementDto) {
    this.validateInput(dto);

    const processed = await this.signalProcessor.analyzePPG(
      dto.irSamples,
      dto.redSamples,
      dto.sampleRate,
    );

    return this.createMeasurement(dto, processed);
  }

  async calculateStrokeRisk(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        birthDate: true,
        gender: true,
        weight: true,
        medicalHistory: true,
        healthReport: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const measurements = await this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      select: {
        heartRate: true,
        heartRateVar: true,
        spo2: true,
        bpSystolic: true,
        atrialFibRisk: true,
        timestamp: true,
      },
    });

    return this.calculateRiskProfile(user, measurements);
  }

  async getLatestResults(userId: string) {
    return this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
  }

  private validateInput(dto: MeasurementDto) {
    if (dto.irSamples.length !== dto.redSamples.length) {
      throw new BadRequestException('IR and Red samples must have same length');
    }
    if (dto.sampleRate < 50 || dto.sampleRate > 200) {
      throw new BadRequestException('Invalid sample rate (50-200Hz allowed)');
    }
  }

  private async createMeasurement(dto: MeasurementDto, processed: any) {
    return this.prisma.measurement.create({
      data: {
        userId: await this.getUserFromDevice(dto.deviceId),
        rawIR: dto.irSamples,
        rawRed: dto.redSamples,
        sampleRate: dto.sampleRate,
        ...processed,
        bpSystolic: this.estimateBloodPressure(dto.irSamples, dto.sampleRate),
        atrialFibRisk: this.calculateAfibRisk(dto.redSamples),
      },
    });
  }

  private async getUserFromDevice(deviceId: string): Promise<string> {
    // Implementar lógica real de mapeamento
    return 'user-id-placeholder';
  }

  private estimateBloodPressure(
    irSamples: number[],
    sampleRate: number,
  ): number {
    // Implementar algoritmo real
    return Math.floor(120 + Math.random() * 10);
  }

  private calculateAfibRisk(redSamples: number[]): number {
    // Implementar cálculo real
    return this.signalProcessor.calculateIrregularity(redSamples);
  }

  private calculateRiskProfile(user: any, measurements: any[]) {
    // Implementar lógica de cálculo de risco real
    return {
      riskScore: 0.35,
      factors: ['hypertension', 'irregular_rhythm'],
      recommendation: 'Consult cardiologist',
    };
  }
}
