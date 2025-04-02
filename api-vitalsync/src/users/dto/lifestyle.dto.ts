import { IsString } from 'class-validator';

export class LifestyleDto {
  @IsString()
  dietType: string;

  @IsString()
  alcoholConsumption: string;

  @IsString()
  stressLevel: string;

  @IsString()
  weeklyWorkHours: string;

  @IsString()
  dailyScreenTime: string;

  @IsString()
  dailyOutdoorTime: string;

  @IsString()
  additionalInfo: string;
}
