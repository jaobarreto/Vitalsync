import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MedicalHistoryDto {
  @ApiProperty({
    example: true,
    description: 'Histórico de hipertensão',
    default: false
  })
  @IsBoolean()
  hypertension: boolean;

  @ApiProperty({
    example: 'Tipo 2',
    description: 'Tipo de diabetes se houver',
    enum: ['Tipo 1', 'Tipo 2', 'Gestacional'],
    required: false
  })
  @IsOptional()
  @IsString()
  diabetesType?: string;

  @ApiProperty({
    example: true,
    description: 'Colesterol alto',
    default: false
  })
  @IsBoolean()
  highCholesterol: boolean;

  @ApiProperty({
    example: false,
    description: 'AVC prévio',
    default: false
  })
  @IsBoolean()
  previousStroke: boolean;
}