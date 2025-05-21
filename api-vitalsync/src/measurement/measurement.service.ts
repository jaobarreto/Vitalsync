import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertService } from '../alert/alert.service';
import { DailySummaryService } from '../daily-summary/daily-summary.service';
import { CreateMeasurementDto } from './dto/measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(
    private prisma: PrismaService,
    private alertService: AlertService,
    private dailySummaryService: DailySummaryService,
  ) {}

  async createMeasurement(
    createMeasurementDto: CreateMeasurementDto,
    userId?: string,
  ) {
    const measurement = await this.prisma.measurement.create({
      data: {
        heartRate: createMeasurementDto.heartRate,
        user: { connect: { id: userId || createMeasurementDto.userId } },
      },
      include: { user: { select: { id: true } } },
    });

    await this.alertService.checkForHeartRateAlert(
      measurement.user.id,
      measurement.heartRate,
      measurement.id,
    );

    await this.dailySummaryService.generateDailySummary(measurement.user.id);

    return measurement;
  }

  async getMeasurementsByUser(userId: string, hours: number = 24) {
    const dateFilter = new Date();
    dateFilter.setHours(dateFilter.getHours() - hours);

    return this.prisma.measurement.findMany({
      where: {
        userId,
        timestamp: { gte: dateFilter },
      },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        heartRate: true,
        timestamp: true,
        userId: true,
      },
    });
  }

  async getLatestMeasurement(userId: string) {
    return this.prisma.measurement.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        heartRate: true,
        timestamp: true,
        userId: true,
      },
    });
  }
}
