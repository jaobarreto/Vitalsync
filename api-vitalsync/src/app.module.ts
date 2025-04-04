import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MeasurementModule } from './measurement/measurement.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MeasurementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
