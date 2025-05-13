import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ArrayMinSize,
} from 'class-validator';

export class MeasurementDto {
  @ApiProperty({
    type: [Number],
    description:
      'Amostras do sinal infravermelho (IR), valores de 12 bits (0–4095)',
    example: [1234, 1456, 1322, 1400, 1290],
  })
  @IsArray()
  @ArrayMinSize(10)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(4095, { each: true })
  irSamples: number[];

  @ApiProperty({
    type: [Number],
    description:
      'Amostras do sinal Red (vermelho), valores de 12 bits (0–4095)',
    example: [1300, 1480, 1330, 1390, 1285],
  })
  @IsArray()
  @ArrayMinSize(10)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(4095, { each: true })
  redSamples: number[];

  @ApiProperty({
    description: 'Taxa de amostragem do sensor em Hz (entre 50 e 200)',
    minimum: 50,
    maximum: 200,
    example: 100,
  })
  @IsInt()
  @Min(50)
  @Max(200)
  sampleRate: number;

  @ApiProperty({
    description: 'ID do usuário vinculado à medição',
    example: '64f5e5b0d1b2a8c9e1234567',
  })
  @IsString()
  userId: string;
}
