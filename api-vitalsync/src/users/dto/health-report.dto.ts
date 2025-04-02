import { IsObject } from 'class-validator';
import { SymptomsDto } from './symptoms.dto';
import { LifestyleDto } from './lifestyle.dto';

export class HealthReportDto {
  @IsObject()
  symptoms: SymptomsDto;

  @IsObject()
  lifestyle: LifestyleDto;
}
