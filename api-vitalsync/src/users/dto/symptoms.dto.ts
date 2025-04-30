import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SymptomsDto {
  @ApiProperty({
    example: 'Ocasional',
    description: 'Frequência de dores de cabeça',
    required: false
  })
  @IsOptional()
  @IsString()
  headache?: string;

  @ApiProperty({ example: 'Raro', required: false })
  @IsOptional()
  @IsString()
  dizzinessVertigo?: string;

  @ApiProperty({ example: 'Frequente', required: false })
  @IsOptional()
  @IsString()
  fatigueWeakness?: string;

  @ApiProperty({ example: 'Nenhuma', required: false })
  @IsOptional()
  @IsString()
  visualChanges?: string;

  @ApiProperty({ example: 'Leve', required: false })
  @IsOptional()
  @IsString()
  numbnessTingling?: string;

  @ApiProperty({ example: 'Nenhuma', required: false })
  @IsOptional()
  @IsString()
  speechDifficulties?: string;

  @ApiProperty({ example: 'Insônia', required: false })
  @IsOptional()
  @IsString()
  additionalSymptoms?: string;
}