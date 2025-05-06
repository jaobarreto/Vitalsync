import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LifestyleDto {
  @ApiProperty({
    example: 'Mediterrânea',
    description: 'Tipo de dieta',
    required: false,
  })
  @IsOptional()
  @IsString()
  dietType?: string;

  @ApiProperty({ example: 'Social', required: false })
  @IsOptional()
  @IsString()
  alcoholConsumption?: string;

  @ApiProperty({ example: 'Moderado', required: false })
  @IsOptional()
  @IsString()
  stressLevel?: string;

  @ApiProperty({ example: '40-50 horas', required: false })
  @IsOptional()
  @IsString()
  weeklyWorkHours?: string;

  @ApiProperty({ example: '4-6 horas', required: false })
  @IsOptional()
  @IsString()
  dailyScreenTime?: string;

  @ApiProperty({ example: '1-2 horas', required: false })
  @IsOptional()
  @IsString()
  dailyOutdoorTime?: string;

  @ApiProperty({ example: 'Pratica yoga', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
