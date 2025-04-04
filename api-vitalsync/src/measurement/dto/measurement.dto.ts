import { IsInt, IsString, Min, Max, IsDate } from 'class-validator';

export class MeasurementDto {
  @IsString()
  userId: string;

  @IsInt()
  @Min(30)
  @Max(220)
  heartRate: number;

  @IsInt()
  @Min(70)
  @Max(100)
  bloodOxygenLevel: number;

  @IsInt()
  hrv: number;

  @IsDate()
  timestamp: Date;
}
