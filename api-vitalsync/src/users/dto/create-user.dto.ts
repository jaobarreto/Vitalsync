/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @IsString()
  password: string;

  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsObject()
  medicalHistory: object;

  @IsObject()
  healthReport: object;
}
