// eslint-disable-next-line prettier/prettier
import { IsString, IsEmail, IsInt, IsNumber, IsObject, IsOptional } from 'class-validator';
import { MedicalHistoryDto } from './medical-history.dto';
import { HealthReportDto } from './health-report.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  age: number;

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
