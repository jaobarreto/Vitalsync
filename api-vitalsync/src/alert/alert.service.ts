import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertType } from '@prisma/client';
import { DailySummaryService } from '../daily-summary/daily-summary.service';
import {
  CreateAlertDto,
  UpdateAlertDto,
  AlertResponseDto,
} from './dto/alert.dto';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly HR_THRESHOLDS = {
    CRITICAL_HIGH: 120,
    CRITICAL_LOW: 50,
    WARNING_HIGH: 100,
    WARNING_LOW: 60,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly dailySummaryService: DailySummaryService,
  ) {}

  async createAlert(
    userId: string,
    createDto: CreateAlertDto,
  ): Promise<AlertResponseDto> {
    if (createDto.measurementId) {
      await this.validateMeasurement(userId, createDto.measurementId);
    }

    const alert = await this.prisma.alert.create({
      data: {
        type: createDto.type,
        message: createDto.message,
        userId,
        measurementId: createDto.measurementId,
      },
      include: { measurement: true },
    });

    this.logger.log(`Alert created: ${alert.id}`);

    await this.dailySummaryService.generateDailySummary(userId);

    return this.mapToDto(alert);
  }

  async checkForHeartRateAlert(
    userId: string,
    heartRate: number,
    measurementId: string,
  ): Promise<AlertResponseDto | null> {
    let type: AlertType | null = null;
    let message = '';

    if (heartRate >= this.HR_THRESHOLDS.CRITICAL_HIGH) {
      type = AlertType.CRITICAL;
      message = `Critical high heart rate: ${heartRate} BPM`;
    } else if (heartRate <= this.HR_THRESHOLDS.CRITICAL_LOW) {
      type = AlertType.CRITICAL;
      message = `Critical low heart rate: ${heartRate} BPM`;
    } else if (heartRate >= this.HR_THRESHOLDS.WARNING_HIGH) {
      type = AlertType.PRECAUTION;
      message = `Warning: Elevated heart rate ${heartRate} BPM`;
    } else if (heartRate <= this.HR_THRESHOLDS.WARNING_LOW) {
      type = AlertType.PRECAUTION;
      message = `Warning: Low heart rate ${heartRate} BPM`;
    }

    if (!type) return null;

    return this.createAlert(userId, {
      type,
      message,
      measurementId,
    });
  }

  async getUserAlerts(
    userId: string,
    resolved?: boolean,
  ): Promise<AlertResponseDto[]> {
    const where: any = { userId };
    if (typeof resolved !== 'undefined') where.resolved = resolved;

    const alerts = await this.prisma.alert.findMany({
      where,
      include: { measurement: true },
      orderBy: { createdAt: 'desc' },
    });

    return alerts.map(this.mapToDto);
  }

  async updateAlert(
    alertId: string,
    updateDto: UpdateAlertDto,
  ): Promise<AlertResponseDto> {
    const alert = await this.prisma.alert.update({
      where: { id: alertId },
      data: { resolved: updateDto.resolved },
      include: { measurement: true },
    });

    this.logger.log(`Alert ${alertId} updated`);
    return this.mapToDto(alert);
  }

  async deleteAlert(alertId: string): Promise<void> {
    await this.prisma.alert.delete({ where: { id: alertId } });
    this.logger.log(`Alert ${alertId} deleted`);
  }

  private async validateMeasurement(userId: string, measurementId: string) {
    const measurement = await this.prisma.measurement.findUnique({
      where: { id: measurementId },
    });

    if (!measurement || measurement.userId !== userId) {
      throw new NotFoundException('Measurement not found or access denied');
    }
  }

  private mapToDto(alert: any): AlertResponseDto {
    return {
      id: alert.id,
      type: alert.type,
      message: alert.message,
      resolved: alert.resolved,
      createdAt: alert.createdAt,
      measurementId: alert.measurementId,
      userId: alert.userId,
    };
  }
}
