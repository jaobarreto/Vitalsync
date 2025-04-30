import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';

export class MeasurementDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsInt()
  @Min(30)
  @Max(220)
  heartRate: number;

  @ApiProperty()
  @IsInt()
  @Min(70)
  @Max(100)
  bloodOxygenLevel: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  hrv: number;

  @ApiProperty({ required: false })
  @IsOptional()
  timestamp?: Date;

  @ApiProperty({ enum: ['routine', 'emergency', 'manual'], required: false })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  dailySummaryId?: string;
}
