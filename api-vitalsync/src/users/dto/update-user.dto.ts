import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: false,
    example: 'novaSenha123',
    description: 'Nova senha (opcional)'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}