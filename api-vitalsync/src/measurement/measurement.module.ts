import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';
import { SignalProcessingService } from './signalProcessing.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MeasurementService, SignalProcessingService, PrismaService],
  controllers: [MeasurementController],
})
export class MeasurementModule {}
