import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementDto } from './dto/measurement.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Biometric Measurements')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post('raw')
  @ApiOperation({ summary: 'Enviar dados brutos do sensor' })
  @ApiResponse({
    status: 201,
    description: 'Dados processados e salvos com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou formato incorreto',
  })
  async receiveRawData(@Body() dto: MeasurementDto) {
    return this.measurementService.processRawData(dto);
  }

  @Get(':userId/risk')
  @ApiOperation({ summary: 'Calcular risco de AVC do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Cálculo de risco retornado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getStrokeRisk(@Param('userId') userId: string) {
    return this.measurementService.calculateStrokeRisk(userId);
  }

  @Get(':userId/latest')
  @ApiOperation({ summary: 'Obter últimas medições do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista das últimas medições',
  })
  async getLatestMeasurements(@Param('userId') userId: string) {
    return this.measurementService.getLatestResults(userId);
  }
}
