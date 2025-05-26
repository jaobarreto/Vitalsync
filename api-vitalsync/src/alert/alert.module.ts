import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DailySummaryModule } from '../daily-summary/daily-summary.module';

@Module({
  imports: [PrismaModule, DailySummaryModule],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
