import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Max } from 'class-validator';

export class MeasurementDto {
  @ApiProperty({
    type: [Number],
    description: 'Amostras IR (12-bit values 0-4095)',
  })
  @IsArray()
  @IsInt({ each: true })
  @Max(4095, { each: true })
  irSamples: number[];

  @ApiProperty({
    type: [Number],
    description: 'Amostras Red (12-bit values 0-4095)',
  })
  @IsArray()
  @IsInt({ each: true })
  @Max(4095, { each: true })
  redSamples: number[];

  @ApiProperty({ minimum: 50, maximum: 200 })
  @IsInt()
  sampleRate: number;

  @ApiProperty({ required: false })
  @IsString()
  deviceId?: string;
}
