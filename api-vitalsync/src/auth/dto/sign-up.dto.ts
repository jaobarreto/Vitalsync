import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsDate } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Fulano Ciclano', description: 'Nome completo do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ example: 'fulano@exemplo.com', description: 'E-mail válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha com mínimo 6 caracteres',
    minLength: 6
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Data de nascimento no formato YYYY-MM-DD'
  })
  @IsDate({ message: 'Informe uma data de nascimento válida' })
  birthDate: Date;

  @ApiProperty({ 
    example: 'Masculino', 
    description: 'Gênero do usuário',
    enum: ['Masculino', 'Feminino', 'Outro'] 
  })
  @IsString({ message: 'Gênero deve ser uma string' })
  gender: string;

  @ApiProperty({ 
    example: 70.5, 
    description: 'Peso em quilogramas' 
  })
  weight: number;

  @ApiProperty({ 
    example: 1.75, 
    description: 'Altura em metros' 
  })
  height: number;
}