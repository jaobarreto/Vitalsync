import { Module, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MeasurementModule } from './measurement/measurement.module';
import { APP_PIPE } from '@nestjs/core';
import { CaregiversModule } from './caregivers/caregivers.module';
import { DailySummaryModule } from './daily-summary/daily-summary.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MeasurementModule,
    CaregiversModule,
    DailySummaryModule,
    AlertModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
