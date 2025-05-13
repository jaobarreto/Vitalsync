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

  async getMeasurementHistory(userId: string) {
    const history = await this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    if (!history.length) {
      throw new NotFoundException('No measurements found for this user');
    }

    return history;
  }

  async deleteMeasurement(id: string) {
    const measurement = await this.prisma.measurement.findUnique({
      where: { id },
    });

    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }

    await this.prisma.measurement.delete({
      where: { id },
    });

    return { message: 'Measurement deleted successfully' };
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
        userId: dto.userId,
        rawIR: dto.irSamples,
        rawRed: dto.redSamples,
        sampleRate: dto.sampleRate,
        ...processed,
        bpSystolic: this.estimateBloodPressure(dto.irSamples, dto.sampleRate),
        atrialFibRisk: this.calculateAfibRisk(dto.redSamples),
      },
    });
  }

  private estimateBloodPressure(
    irSamples: number[],
    sampleRate: number,
  ): number {
    const heartRate = this.signalProcessor.calculateHeartRate(
      irSamples,
      sampleRate,
    );
    const hrv = this.signalProcessor.calculateHRV(irSamples);

    // Algoritmo básico: usa HR + HRV como proxy da pressão
    const baseSystolic = 110 + (heartRate > 100 ? 10 : 0) - hrv * 0.2;
    return Math.round(baseSystolic + Math.random() * 5); // ruído
  }

  private calculateAfibRisk(redSamples: number[]): number {
    const irregularity = this.signalProcessor.calculateIrregularity(redSamples);
    return Math.min(1, irregularity) * 100; // percentual de risco
  }

  private calculateRiskProfile(user: any, measurements: any[]) {
    const lastMeasurement = measurements[measurements.length - 1];

    const riskFactors = [];

    if (
      user?.medicalHistory?.includes('hypertension') ||
      lastMeasurement.bpSystolic > 130
    ) {
      riskFactors.push('hypertension');
    }

    if (lastMeasurement.atrialFibRisk > 50) {
      riskFactors.push('irregular_rhythm');
    }

    const riskScore = Number((riskFactors.length / 3).toFixed(2)); // arbitrário, 3 fatores máx

    const recommendation =
      riskScore > 0.5 ? 'Consult cardiologist' : 'Maintain monitoring';

    return {
      riskScore,
      factors: riskFactors,
      recommendation,
    };
  }
}
