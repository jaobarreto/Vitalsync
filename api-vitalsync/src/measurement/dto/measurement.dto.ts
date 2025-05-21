import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMeasurementDto {
  @ApiProperty({
    description: 'Valor do batimento cardíaco em BPM',
    example: 75,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  heartRate: number;

  @ApiProperty({
    description: 'ID do usuário (opcional, pode vir do token)',
    example: '663d9b15d11aac5f406697a5',
    required: false,
  })
  @IsOptional()
  userId?: string;
}

export class MeasurementResponseDto {
  @ApiProperty({ description: 'ID único da medição' })
  id: string;

  @ApiProperty({ description: 'Batimento cardíaco em BPM', example: 75 })
  heartRate: number;

  @ApiProperty({ description: 'Data e hora da medição', type: Date })
  timestamp: Date;

  @ApiProperty({
    description: 'ID do usuário associado',
    example: '663d9b15d11aac5f406697a5',
  })
  userId: string;
}
