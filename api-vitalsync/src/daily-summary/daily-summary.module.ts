import { Module } from '@nestjs/common';
import { DailySummaryService } from './daily-summary.service';
import { DailySummaryController } from './daily-summary.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailySummaryController],
  providers: [DailySummaryService],
  exports: [DailySummaryService],
})
export class DailySummaryModule {}
