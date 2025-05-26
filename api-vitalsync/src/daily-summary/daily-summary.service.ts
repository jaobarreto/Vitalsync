import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DailySummaryResponseDto,
  DailySummaryQueryDto,
} from './dto/daily-summary.dto';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class DailySummaryService {
  private readonly logger = new Logger(DailySummaryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateDailySummary(userId: string): Promise<DailySummaryResponseDto> {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const [aggregations, alertsCount] = await Promise.all([
      this.prisma.measurement.aggregate({
        _avg: { heartRate: true },
        where: {
          userId,
          timestamp: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.alert.count({
        where: {
          userId,
          createdAt: {
            gte: start,
            lte: end,
          },
          resolved: false,
        },
      }),
    ]);

    const summary = await this.prisma.dailySummary.upsert({
      where: {
        userId_date: {
          userId,
          date: start,
        },
      },
      update: {
        avgHeartRate: aggregations._avg.heartRate || 0,
        alertCount: alertsCount,
      },
      create: {
        date: start,
        avgHeartRate: aggregations._avg.heartRate || 0,
        alertCount: alertsCount,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        measurements: true,
      },
    });

    return this.mapToDto(summary);
  }

  async getSummaries(
    userId: string,
    query: DailySummaryQueryDto,
  ): Promise<DailySummaryResponseDto[]> {
    const where: any = { userId };

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = startOfDay(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = endOfDay(query.endDate);
      }
    }

    const summaries = await this.prisma.dailySummary.findMany({
      where,
      include: { measurements: true },
      orderBy: { date: 'desc' },
    });

    return summaries.map((summary) => this.mapToDto(summary));
  }

  private mapToDto(summary: any): DailySummaryResponseDto {
    return {
      id: summary.id,
      date: summary.date,
      avgHeartRate: summary.avgHeartRate,
      alertCount: summary.alertCount,
      measurements: summary.measurements,
      userId: summary.userId,
    };
  }
}
