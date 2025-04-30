import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsObject, IsOptional, IsDate } from 'class-validator';
import { MedicalHistoryDto } from './medical-history.dto';
import { HealthReportDto } from './health-report.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'Fulano Ciclano', description: 'Nome completo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'fulano@exemplo.com', description: 'E-mail válido' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha mínima 6 caracteres' })
  @IsString()
  password: string;

  @ApiProperty({
    example: '1985-07-20T00:00:00.000Z',
    description: 'Data de nascimento em ISO8601'
  })
  @IsDate()
  birthDate: Date;

  @ApiProperty({ 
    example: 'Outro', 
    enum: ['Masculino', 'Feminino', 'Outro'] 
  })
  @IsString()
  gender: string;

  @ApiProperty({ example: 68.5, description: 'Peso em kg' })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 1.65, description: 'Altura em metros' })
  @IsNumber()
  height: number;

  @ApiProperty({ type: MedicalHistoryDto, required: false })
  @IsOptional()
  @IsObject()
  medicalHistory?: MedicalHistoryDto;

  @ApiProperty({ type: HealthReportDto, required: false })
  @IsOptional()
  @IsObject()
  healthReport?: HealthReportDto;
}