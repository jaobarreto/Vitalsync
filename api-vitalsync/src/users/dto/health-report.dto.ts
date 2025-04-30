import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { SymptomsDto } from './symptoms.dto';
import { LifestyleDto } from './lifestyle.dto';

export class HealthReportDto {
  @ApiProperty({ type: SymptomsDto })
  @IsObject()
  symptoms: SymptomsDto;

  @ApiProperty({ type: LifestyleDto })
  @IsObject()
  lifestyle: LifestyleDto;
}