import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementDto } from './dto/measurement.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Measurements')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('measurement')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova medição' })
  @ApiResponse({
    status: 201,
    description: 'Medição criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiBody({ type: MeasurementDto })
  async create(@Body() data: MeasurementDto) {
    return this.measurementService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as medições' })
  @ApiResponse({
    status: 200,
    description: 'Lista de medições retornada',
  })
  async findAll() {
    return this.measurementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter medição específica' })
  @ApiParam({ name: 'id', description: 'ID da medição' })
  @ApiResponse({
    status: 200,
    description: 'Medição encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Medição não encontrada',
  })
  async findOne(@Param('id') id: string) {
    return this.measurementService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover medição' })
  @ApiParam({ name: 'id', description: 'ID da medição' })
  @ApiResponse({
    status: 200,
    description: 'Medição removida',
  })
  @ApiResponse({
    status: 404,
    description: 'Medição não encontrada',
  })
  async remove(@Param('id') id: string) {
    return this.measurementService.delete(id);
  }

  @Post('mock')
  @ApiOperation({ summary: 'Gerar dados mockados' })
  @ApiResponse({
    status: 201,
    description: 'Dados mockados gerados',
  })
  async generateMock() {
    return this.measurementService.generateMockData();
  }
}
