import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { AlertType } from '@prisma/client';

export class CreateAlertDto {
  @ApiProperty({ enum: AlertType, description: 'Tipo do alerta' })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ description: 'Mensagem descritiva do alerta' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    required: false,
    description: 'ID da medição relacionada (opcional)',
  })
  @IsString()
  @IsOptional()
  measurementId?: string;
}

export class UpdateAlertDto {
  @ApiProperty({ description: 'Status de resolução do alerta' })
  @IsBoolean()
  resolved: boolean;
}

export class AlertResponseDto {
  @ApiProperty({ description: 'ID único do alerta' })
  id: string;

  @ApiProperty({ enum: AlertType, description: 'Tipo do alerta' })
  type: AlertType;

  @ApiProperty({ description: 'Mensagem descritiva' })
  message: string;

  @ApiProperty({ description: 'Status de resolução' })
  resolved: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: 'ID da medição relacionada',
  })
  measurementId?: string;

  @ApiProperty({ description: 'ID do usuário relacionado' })
  userId: string;
}
