// eslint-disable-next-line prettier/prettier
import { IsString, IsEmail, IsNumber, IsObject, IsOptional, IsDate } from 'class-validator';
import { MedicalHistoryDto } from './medical-history.dto';
import { HealthReportDto } from './health-report.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDate()
  birthDate: Date;

  @IsString()
  gender: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsOptional()
  @IsObject()
  medicalHistory?: MedicalHistoryDto;

  @IsOptional()
  @IsObject()
  healthReport?: HealthReportDto;
}
