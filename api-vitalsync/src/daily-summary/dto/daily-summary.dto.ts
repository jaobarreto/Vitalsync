import { ApiProperty } from '@nestjs/swagger';
import { MeasurementResponseDto } from '../../measurement/dto/measurement.dto';

export class DailySummaryResponseDto {
  @ApiProperty({ description: 'ID único do resumo diário' })
  id: string;

  @ApiProperty({ description: 'Data do resumo (YYYY-MM-DD)' })
  date: Date;

  @ApiProperty({ description: 'Média de batimentos cardíacos do dia' })
  avgHeartRate: number;

  @ApiProperty({ description: 'Total de alertas no dia' })
  alertCount: number;

  @ApiProperty({
    description: 'Medições do dia',
    type: [MeasurementResponseDto],
  })
  measurements: MeasurementResponseDto[];

  @ApiProperty({ description: 'ID do usuário relacionado' })
  userId: string;
}

export class DailySummaryQueryDto {
  @ApiProperty({
    required: false,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  startDate?: Date;

  @ApiProperty({
    required: false,
    description: 'Data final (YYYY-MM-DD)',
  })
  endDate?: Date;
}
