import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';

@Module({
  providers: [MeasurementService],
  controllers: [MeasurementController]
})
export class MeasurementModule {}
