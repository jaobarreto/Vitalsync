import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';
import { AlertModule } from 'src/alert/alert.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DailySummaryModule } from 'src/daily-summary/daily-summary.module';

@Module({
  imports: [PrismaModule, AlertModule, DailySummaryModule],
  providers: [MeasurementService],
  controllers: [MeasurementController],
})
export class MeasurementModule {}
