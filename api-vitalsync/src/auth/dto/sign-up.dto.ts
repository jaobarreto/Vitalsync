import { IsEmail, IsNotEmpty, MinLength, IsInt, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsInt({ message: 'Idade deve ser um número' })
  age: number;

  @IsString({ message: 'Gênero deve ser uma string' })
  gender: string;

  @IsInt({ message: 'Peso deve ser um número' })
  weight: number;

  @IsInt({ message: 'Altura deve ser um número' })
  height: number;
}
