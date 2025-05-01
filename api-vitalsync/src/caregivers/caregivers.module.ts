import { Module } from '@nestjs/common';
import { CaregiversService } from './caregivers.service';
import { CaregiversController } from './caregivers.controller';

@Module({
  controllers: [CaregiversController],
  providers: [CaregiversService],
})
export class CaregiversModule {}
